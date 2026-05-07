export const formatUsdc = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
};

export const MIN_USDC_AMOUNT = 1; // 1 USDC minimum

export const validateUsdcAmount = (amount: number, minAmount: number = MIN_USDC_AMOUNT): boolean => {
  return !isNaN(amount) && amount >= minAmount && amount <= 1000000;
};
