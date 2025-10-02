import { useQuery, useMutation } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryClient, apiRequest } from "@/lib/queryClient";

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

interface CurrencySelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const { data: settingsData } = useQuery<{ currency: string }>({
    queryKey: ["/api/settings/currency"],
  });

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

  const currency = value || settingsData?.currency || "USD";

  const handleChange = (newValue: string) => {
    updateCurrencyMutation.mutate(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center gap-2">
      <DollarSign className="w-4 h-4 text-muted-foreground" />
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
