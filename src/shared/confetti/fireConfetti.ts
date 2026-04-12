import confetti from 'canvas-confetti';

// fireConfetti is a small wrapper around canvas-confetti that encodes the
// two celebration profiles Lexica uses: a soft burst on level-up and a
// louder burst on a perfect day. Keeping the presets here lets the UI
// call them by name without sprinkling tuning constants across pages.

export type ConfettiProfile = 'level_up' | 'perfect_day';

export function fireConfetti(profile: ConfettiProfile): void {
  if (profile === 'level_up') {
    void confetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 40,
      origin: { y: 0.6 },
      colors: ['#2D6A4F', '#52B788', '#D8F3DC', '#40916C'],
    });
    return;
  }

  // Perfect day: two side bursts so the whole viewport lights up.
  const end = Date.now() + 600;
  const colors = ['#E09F3E', '#2D6A4F', '#52B788', '#FAFAF8'];

  const frame = (): void => {
    void confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    void confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
