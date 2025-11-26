
export const formatNumber = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatGCO2eq = (value: number): string => {
  if (Math.abs(value) >= 1e9) {
    return `${formatNumber(value / 1e9)}B`;
  }
  if (Math.abs(value) >= 1e6) {
    return `${formatNumber(value / 1e6)}M`;
  }
  if (Math.abs(value) >= 1e3) {
    return `${formatNumber(value / 1e3)}K`;
  }
  return formatNumber(value);
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${formatNumber(value)}%`;
};