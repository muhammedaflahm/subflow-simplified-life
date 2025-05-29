
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyInfo, detectUserCurrency, currencies } from '@/utils/currencyUtils';

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrency: (currency: CurrencyInfo) => void;
  availableCurrencies: CurrencyInfo[];
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyInfo>(currencies.USD);
  const [isLoading, setIsLoading] = useState(true);
  const availableCurrencies = Object.values(currencies);

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        const detectedCurrency = await detectUserCurrency();
        setCurrency(detectedCurrency);
      } catch (error) {
        console.error('Failed to detect currency:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCurrency();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        availableCurrencies,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
