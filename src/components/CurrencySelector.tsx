
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Globe } from 'lucide-react';

const CurrencySelector = () => {
  const { currency, setCurrency, availableCurrencies, isLoading } = useCurrency();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Globe className="w-4 h-4 animate-spin" />
        <span>Detecting...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <Select
        value={currency.code}
        onValueChange={(value) => {
          const selectedCurrency = availableCurrencies.find(c => c.code === value);
          if (selectedCurrency) {
            setCurrency(selectedCurrency);
          }
        }}
      >
        <SelectTrigger className="w-24 h-8 text-xs border-0 bg-transparent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableCurrencies.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              {curr.symbol} {curr.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
