export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompactNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const calculateMortgage = (principal, rate, years) => {
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = years * 12;
  
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(monthlyPayment * numberOfPayments),
    totalInterest: Math.round(monthlyPayment * numberOfPayments - principal),
  };
};

export const calculateROI = (initialInvestment, currentValue) => {
  return ((currentValue - initialInvestment) / initialInvestment) * 100;
};

export const formatPriceRange = (min, max) => {
  if (!min && !max) return 'Any Price';
  if (!min) return `Up to ${formatCurrency(max)}`;
  if (!max) return `From ${formatCurrency(min)}`;
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
};