import { useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useCurrency } from "@/hooks/use-currency";

interface CurrencySelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const { code, symbol, currencies } = useCurrency();

  const updateCurrencyMutation = useMutation({
    mutationFn: async (currency: string) => {
      return apiRequest("POST", "/api/settings/currency", { currency });
    },
    onMutate: async (newCurrency) => {
      await queryClient.cancelQueries({ queryKey: ["/api/settings/currency"] });
      const previousData = queryClient.getQueryData(["/api/settings/currency"]);
      queryClient.setQueryData(["/api/settings/currency"], { currency: newCurrency });
      return { previousData };
    },
    onError: (err, newCurrency, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(["/api/settings/currency"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/currency"] });
    },
  });

  const currency = value || code;

  const handleChange = (newValue: string) => {
    updateCurrencyMutation.mutate(newValue);
    onChange?.(newValue);
  };

  const currentCurrencyInfo = currencies.find(c => c.code === currency);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">{currentCurrencyInfo?.symbol}</span>
      <Select value={currency} onValueChange={handleChange}>
        <SelectTrigger className="w-[140px]" data-testid="select-currency">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              {curr.symbol} {curr.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
