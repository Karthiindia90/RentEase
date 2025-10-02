import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";

interface PaymentHistoryItemProps {
  id: string;
  date: Date;
  amount: number;
  mode: string;
  balance: number;
}

export default function PaymentHistoryItem({ id, date, amount, mode, balance }: PaymentHistoryItemProps) {
  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0" data-testid={`payment-${id}`}>
      <div className="flex-shrink-0 mt-1">
        <CheckCircle2 className="w-5 h-5 text-success" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="font-medium">${amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{mode}</p>
          </div>
          <p className="text-sm text-muted-foreground">{format(date, "MMM d, yyyy")}</p>
        </div>
        <p className="text-xs text-muted-foreground">Balance: ${balance.toFixed(2)}</p>
      </div>
    </div>
  );
}
