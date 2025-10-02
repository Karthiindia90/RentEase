import { useQuery } from "@tanstack/react-query";

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

export function useCurrency() {
  const { data: settingsData } = useQuery<{ currency: string }>({
    queryKey: ["/api/settings/currency"],
  });

  const currencyCode = settingsData?.currency || "USD";
  const currencyInfo = currencies.find(c => c.code === currencyCode) || currencies[0];

  return {
    code: currencyCode,
    symbol: currencyInfo.symbol,
    name: currencyInfo.name,
    currencies,
  };
}
