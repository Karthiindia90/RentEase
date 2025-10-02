import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface PlanCardProps {
  id: string;
  name: string;
  rate: number;
  onEdit?: () => void;
}

export default function PlanCard({ id, name, rate, onEdit }: PlanCardProps) {
  return (
    <Card className="p-4" data-testid={`plan-card-${id}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold mb-1" data-testid={`plan-name-${id}`}>{name}</h3>
          <p className="text-2xl font-bold text-primary" data-testid={`plan-rate-${id}`}>
            ${rate.toFixed(2)}
            <span className="text-sm text-muted-foreground font-normal">/month</span>
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onEdit}
          data-testid={`button-edit-plan-${id}`}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
