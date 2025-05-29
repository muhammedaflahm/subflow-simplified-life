
export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate relative to USD
}

export const currencies: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.85 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 150 },
};

export const getCurrencyByCountry = (countryCode: string): CurrencyInfo => {
  const countryToCurrency: Record<string, string> = {
    US: 'USD',
    CA: 'CAD',
    GB: 'GBP',
    AU: 'AUD',
    JP: 'JPY',
    IN: 'INR',
    DE: 'EUR',
    FR: 'EUR',
    IT: 'EUR',
    ES: 'EUR',
    NL: 'EUR',
  };

  const currencyCode = countryToCurrency[countryCode] || 'USD';
  return currencies[currencyCode];
};

export const detectUserCurrency = async (): Promise<CurrencyInfo> => {
  try {
    // Try to get user's country from geolocation API
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.country_code) {
      return getCurrencyByCountry(data.country_code);
    }
  } catch (error) {
    console.log('Could not detect location, defaulting to USD');
  }
  
  return currencies.USD;
};

export const convertPrice = (basePrice: number, fromCurrency: CurrencyInfo, toCurrency: CurrencyInfo): number => {
  // Convert to USD first, then to target currency
  const usdPrice = basePrice / fromCurrency.rate;
  return Math.round(usdPrice * toCurrency.rate * 100) / 100; // Round to 2 decimal places
};

export const formatPrice = (price: number, currency: CurrencyInfo): string => {
  return `${currency.symbol}${price.toFixed(2)}`;
};

// Convert subscription price from USD to user's currency
export const convertSubscriptionPrice = (usdPrice: number, targetCurrency: CurrencyInfo): number => {
  return convertPrice(usdPrice, currencies.USD, targetCurrency);
};

// Get Razorpay currency code (some currencies need specific codes for Razorpay)
export const getRazorpayCurrency = (currency: CurrencyInfo): string => {
  // Razorpay primarily supports INR, but also supports international currencies
  const supportedCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD'];
  return supportedCurrencies.includes(currency.code) ? currency.code : 'USD';
};
