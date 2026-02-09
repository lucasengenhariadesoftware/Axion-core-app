import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { useUserStore } from './store/userStore';
import { AdManager } from './services/AdManager';
import Onboarding from './pages/Onboarding';
import { AppLayout } from './components/layout/AppLayout';
import { useRoutineAlarm } from './hooks/useRoutineAlarm';
import AlarmModal from './components/ui/AlarmModal';

// Tabs
import TodayTab from './pages/tabs/Today';
import WorkoutTab from './pages/tabs/Workout';
import WorkoutPlayer from './pages/workout/WorkoutPlayer';
import DietTab from './pages/tabs/Diet';
import RunTab from './pages/tabs/Run';
import ProgressTab from './pages/tabs/Progress';
import CoachTab from './pages/tabs/Coach';
import ProfileTab from './pages/tabs/Profile';
import PrivacyPolicy from './pages/settings/PrivacyPolicy';

function App() {
    const { isOnboarded } = useUserStore();
    const [location, setLocation] = useLocation();

    useEffect(() => {
        AdManager.initialize();

        const onboarded = isOnboarded();

        // Safety: If not onboarded and trying to access app, go to onboarding
        if (!onboarded && location !== '/onboarding') {
            setLocation('/onboarding');
        }
        // Redirect root based on status
        else if (location === '/') {
            setLocation(onboarded ? '/app' : '/onboarding');
        }
    }, [isOnboarded, location, setLocation]);

    const { activeAlarm, dismissAlarm } = useRoutineAlarm();

    return (
        <>
            {activeAlarm && (
                <AlarmModal
                    title={activeAlarm.title}
                    time={activeAlarm.time}
                    onDismiss={dismissAlarm}
                />
            )}
            <Switch>
                <Route path="/onboarding" component={Onboarding} />

                {/* App Routes with Layout */}
                <Route path="/app/:rest*">
                    {/* Check if we are in a fullscreen route like the player */}
                    <Switch>
                        <Route path="/app/workout/session/:sessionId" component={WorkoutPlayer} />

                        <Route path="/app/:rest*">
                            <AppLayout>
                                <Switch>
                                    <Route path="/app" component={TodayTab} />
                                    <Route path="/app/workout" component={WorkoutTab} />
                                    <Route path="/app/diet" component={DietTab} />
                                    <Route path="/app/run" component={RunTab} />
                                    <Route path="/app/progress" component={ProgressTab} />
                                    <Route path="/app/coach" component={CoachTab} />
                                    <Route path="/app/profile" component={ProfileTab} />
                                    <Route path="/app/privacy" component={PrivacyPolicy} />
                                </Switch>
                            </AppLayout>
                        </Route>
                    </Switch>
                </Route>

                <Route path="/">
                    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Carregando...
                    </div>
                </Route>
            </Switch>
        </>
    );
}

export default App;
