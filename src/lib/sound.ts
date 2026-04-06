
let activeCtx: AudioContext | null = null;
let timeouts: NodeJS.Timeout[] = [];

export const stopAlarmSound = () => {
    timeouts.forEach((id) => clearTimeout(id));
    timeouts = [];
    if (activeCtx) {
        activeCtx.close().catch(console.error);
        activeCtx = null;
    }
};

export const playAlarmSound = () => {
    stopAlarmSound(); // Ensure any previous one is stopped

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    activeCtx = new AudioContextClass();

    const playTone = (freq: number, type: 'sine' | 'square' | 'triangle', startTime: number, duration: number) => {
        if (!activeCtx) return;
        const osc = activeCtx.createOscillator();
        const gain = activeCtx.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(activeCtx.destination);

        osc.start(startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.5, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.stop(startTime + duration);
    };

    const playMelody = () => {
        if (!activeCtx) return;
        const start = activeCtx.currentTime;
        playTone(440, 'sine', start, 0.5); // A4
        playTone(554.37, 'sine', start + 0.2, 0.5); // C#5
        playTone(659.25, 'sine', start + 0.4, 0.8); // E5
    };

    // Play melody immediately
    playMelody();

    // Repeat 5 times (total ~8 seconds loop)
    for (let i = 1; i <= 5; i++) {
        const id = setTimeout(() => {
            playMelody();
        }, 1500 * i);
        timeouts.push(id);
    }
};
