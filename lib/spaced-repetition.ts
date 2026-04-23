// SM-2 spaced repetition algorithm
export interface SM2Card {
  ease_factor: number;   // default 2.5
  interval: number;      // days until next review
  repetitions: number;
  next_review: Date;
}

export function sm2(card: SM2Card, quality: 0 | 1 | 2 | 3 | 4 | 5): SM2Card {
  let { ease_factor, interval, repetitions } = card;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease_factor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  ease_factor = Math.max(
    1.3,
    ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  const next_review = new Date();
  next_review.setDate(next_review.getDate() + interval);

  return { ease_factor, interval, repetitions, next_review };
}

export function isDue(next_review: string | Date): boolean {
  return new Date(next_review) <= new Date();
}

export function getDefaultCard(): SM2Card {
  return {
    ease_factor: 2.5,
    interval: 0,
    repetitions: 0,
    next_review: new Date(),
  };
}
