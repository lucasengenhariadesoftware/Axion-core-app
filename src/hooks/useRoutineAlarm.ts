
import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { playAlarmSound, stopAlarmSound } from '../lib/sound';
import { LocalNotifications } from '@capacitor/local-notifications';

export function useRoutineAlarm() {
    const { dailyPlan } = useUserStore();
    const [activeAlarm, setActiveAlarm] = useState<{ title: string; time: string } | null>(null);
    const [triggeredAlarms, setTriggeredAlarms] = useState<Set<string>>(new Set());

    useEffect(() => {
        const checkAlarms = () => {
            if (!dailyPlan?.routineItems) return;

            const now = new Date();
            const currentHour = now.getHours().toString().padStart(2, '0');
            const currentMinute = now.getMinutes().toString().padStart(2, '0');
            const currentTime = `${currentHour}:${currentMinute}`;

            dailyPlan.routineItems.forEach(item => {
                if (item.alarmEnabled && item.startTime === currentTime && !item.completed) {
                    const todayStr = now.toDateString();
                    const alarmKey = `${item.id}-${todayStr}-${currentTime}`;

                    if (!triggeredAlarms.has(alarmKey)) {
                        // Trigger Alarm
                        setActiveAlarm({ title: item.title, time: item.startTime });
                        playAlarmSound();
                        setTriggeredAlarms(prev => new Set(prev).add(alarmKey));
                    }
                }
            });
        };

        const interval = setInterval(checkAlarms, 1000 * 10); // Check every 10 seconds

        // Listen for local notification interactions
        const notificationListener = LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
            const extra = notificationAction.notification.extra;
            if (extra && extra.title && extra.time) {
                if (notificationAction.actionId === 'dismiss') {
                    // Just clear it and stop sound if playing
                    setActiveAlarm(null);
                    stopAlarmSound();
                } else {
                    // Normal click, show alarm modal
                    setActiveAlarm({ title: extra.title, time: extra.time });
                    playAlarmSound();
                }
            }
        });

        return () => {
            clearInterval(interval);
            notificationListener.then(l => l.remove());
        };
    }, [dailyPlan, triggeredAlarms]);

    return {
        activeAlarm,
        dismissAlarm: () => {
            setActiveAlarm(null);
            stopAlarmSound();
        }
    };
}
