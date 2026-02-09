
import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { playAlarmSound } from '../lib/sound';

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
                    const alarmKey = `${item.id}-${currentTime}`;

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

        return () => clearInterval(interval);
    }, [dailyPlan, triggeredAlarms]);

    return {
        activeAlarm,
        dismissAlarm: () => setActiveAlarm(null)
    };
}
