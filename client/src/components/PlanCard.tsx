import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";

interface PlanCardProps {
  id: string;
  name: string;
  rate: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PlanCard({ id, name, rate, onEdit, onDelete }: PlanCardProps) {
  const { symbol } = useCurrency();

  return (
    <Card className="p-4" data-testid={`plan-card-${id}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold mb-1" data-testid={`plan-name-${id}`}>{name}</h3>
          <p className="text-2xl font-bold text-primary" data-testid={`plan-rate-${id}`}>
            {symbol}{rate.toFixed(2)}
            <span className="text-sm text-muted-foreground font-normal">/month</span>
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={onEdit}
            data-testid={`button-edit-plan-${id}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onDelete}
              data-testid={`button-delete-plan-${id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
