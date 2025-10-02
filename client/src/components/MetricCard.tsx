import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "default" | "success" | "warning" | "error";
  onClick?: () => void;
}

export default function MetricCard({ title, value, icon: Icon, color = "default", onClick }: MetricCardProps) {
  const colorClasses = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    error: "text-destructive",
  };

  return (
    <Card
      className={`p-4 ${onClick ? "cursor-pointer hover-elevate active-elevate-2" : ""}`}
      onClick={onClick}
      data-testid={`metric-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`${colorClasses[color]} p-2 rounded-md bg-accent`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}
