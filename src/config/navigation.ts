import { Home, Dumbbell, Utensils, Timer, TrendingUp, User, Bot } from 'lucide-react';

export const NAV_ITEMS = [
    { id: 'today', label: 'menu.today', icon: Home, path: '/app' },
    { id: 'workout', label: 'menu.workout', icon: Dumbbell, path: '/app/workout' },
    { id: 'diet', label: 'menu.diet', icon: Utensils, path: '/app/diet' },
    { id: 'run', label: 'menu.run', icon: Timer, path: '/app/run' },
    { id: 'progress', label: 'menu.evolution', icon: TrendingUp, path: '/app/progress' },
    { id: 'coach', label: 'Coach', icon: Bot, path: '/app/coach' },
    { id: 'profile', label: 'menu.profile', icon: User, path: '/app/profile' },
];
