export const STARDUST_PER_CREDIT = 100;

export function creditsToStardust(credits: number): number {
  return Math.max(0, credits) * STARDUST_PER_CREDIT;
}
