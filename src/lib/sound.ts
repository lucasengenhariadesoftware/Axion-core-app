
export const playAlarmSound = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    const playTone = (freq: number, type: 'sine' | 'square' | 'triangle', startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.5, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        osc.stop(startTime + duration);
    };

    const playMelody = (timeOffset: number) => {
        const start = ctx.currentTime + timeOffset;
        playTone(440, 'sine', start, 0.5); // A4
        playTone(554.37, 'sine', start + 0.2, 0.5); // C#5
        playTone(659.25, 'sine', start + 0.4, 0.8); // E5
    };

    // Play melody immediately
    playMelody(0);

    // Repeat 5 times (total ~8 seconds loop)
    for (let i = 1; i <= 5; i++) {
        setTimeout(() => {
            // Need to create new context or check state? 
            // Actually AudioContext time flows continuously. We can just schedule ahead.
            // But setTimeout might drift. Better to schedule all at once relative to context time.
            const now = ctx.currentTime;
            // However, inside setTimeout ctx.currentTime will be 'now'.
            playMelody(0);
        }, 1500 * i);
    }
};
