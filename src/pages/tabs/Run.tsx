import { useRunStore } from '../../store/runStore';
import RunReady from '../../components/run/RunReady';
import RunTracker from '../../components/run/RunTracker';
import RunSummary from '../../components/run/RunSummary';

export default function RunTab() {
    const { status } = useRunStore();

    // Fill screen relative to container
    const containerStyle: React.CSSProperties = {
        height: 'calc(100vh - 80px)', // Adjust for bottom nav if necessary approx 80px
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden' // prevent map spill
    };

    return (
        <div style={containerStyle}>
            {status === 'ready' && <RunReady />}
            {(status === 'running' || status === 'paused') && <RunTracker />}
            {status === 'finished' && <RunSummary />}
        </div>
    );
}
