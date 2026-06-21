export const STARDUST_PER_CREDIT = 100;
export const FOLLOW_UP_STARDUST_COST = 20;

export type LegacyCreditBalance = {
  remaining_credits: number;
  total_credits: number;
};

export type StardustCreditBalance = LegacyCreditBalance & {
  remaining_stardust?: number;
  total_stardust?: number;
};

export function creditsToStardust(credits: number): number {
  return Math.max(0, credits) * STARDUST_PER_CREDIT;
}

export function getRemainingStardust(credits: StardustCreditBalance): number {
  return typeof credits.remaining_stardust === "number"
    ? Math.max(0, credits.remaining_stardust)
    : creditsToStardust(credits.remaining_credits);
}

export function getTotalStardust(credits: StardustCreditBalance): number {
  return typeof credits.total_stardust === "number"
    ? Math.max(0, credits.total_stardust)
    : creditsToStardust(credits.total_credits);
}
