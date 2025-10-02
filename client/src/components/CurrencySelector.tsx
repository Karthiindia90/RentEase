import { useState } from "react";
import { DollarSign } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function CurrencySelector({ value = "USD", onChange }: CurrencySelectorProps) {
  const [currency, setCurrency] = useState(value);

  const handleChange = (newValue: string) => {
    setCurrency(newValue);
    onChange?.(newValue);
    console.log("Currency changed to:", newValue);
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
