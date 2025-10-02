import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DollarSign, History } from "lucide-react";
import PaymentCollectionDialog from "./PaymentCollectionDialog";

interface TenantCardProps {
  id: string;
  name: string;
  address: string;
  status: "paid" | "overdue" | "pending";
  lastPaymentDate: Date;
  balance: number;
  onClick?: () => void;
  onPaymentCollect?: () => void;
  onViewHistory?: () => void;
}

export default function TenantCard({
  id,
  name,
  address,
  status,
  lastPaymentDate,
  balance,
  onClick,
  onPaymentCollect,
  onViewHistory,
}: TenantCardProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const statusConfig = {
    paid: { label: "Paid", color: "bg-success text-white" },
    overdue: { label: "Overdue", color: "bg-overdue text-white" },
    pending: { label: "Due Soon", color: "bg-pending text-white" },
  };

  const borderColor = {
    paid: "border-l-success",
    overdue: "border-l-overdue",
    pending: "border-l-pending",
  };

  return (
    <>
      <Card
        className={`p-4 border-l-4 ${borderColor[status]}`}
        data-testid={`tenant-card-${id}`}
      >
        <div 
          className="cursor-pointer hover-elevate active-elevate-2 -m-4 p-4 mb-0"
          onClick={onClick}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate" data-testid={`tenant-name-${id}`}>{name}</h3>
                <Badge className={`${statusConfig[status].color} text-xs`}>
                  {statusConfig[status].label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate mb-2">{address}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Last payment: {format(lastPaymentDate, "MMM d, yyyy")}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-bold" data-testid={`tenant-balance-${id}`}>${balance.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Balance</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          <Button
            size="sm"
            variant="default"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              setShowPaymentDialog(true);
              onPaymentCollect?.();
            }}
            data-testid={`button-collect-payment-${id}`}
          >
            <DollarSign className="w-4 h-4 mr-1" />
            Collect Payment
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              console.log(`View history for tenant ${id}`);
              onViewHistory?.();
            }}
            data-testid={`button-view-history-${id}`}
          >
            <History className="w-4 h-4 mr-1" />
            History
          </Button>
        </div>
      </Card>

      <PaymentCollectionDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        tenantId={id}
        tenantName={name}
        currentBalance={balance}
      />
    </>
  );
}
