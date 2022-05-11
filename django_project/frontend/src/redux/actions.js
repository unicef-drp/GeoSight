export const INCREASE_COUNTER = 'counter/increase';
export const DECREASE_COUNTER = 'counter/decrease';

export function increaseCounter() {
  return { type: INCREASE_COUNTER };
}

export function decreaseCounter() {
  return { type: DECREASE_COUNTER };
}
