import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
import { format } from "date-fns";

export default function Reports() {
  const [dateRange, setDateRange] = useState("today");

  const dateRangeOptions = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "custom", label: "Custom" },
  ];

  const todayCollection = 3200;
  const monthCollection = 18500;
  const pendingTenants = [
    { name: "Sarah Johnson", amount: 1200 },
    { name: "David Wilson", amount: 950 },
    { name: "Michael Brown", amount: 850 },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto pb-20">
      <header className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3">
        <h1 className="text-xl font-semibold">Reports</h1>
      </header>

      <div className="flex-1 p-4 space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Date Range</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dateRangeOptions.map((option) => (
              <Button
                key={option.id}
                variant={dateRange === option.id ? "default" : "secondary"}
                size="sm"
                onClick={() => {
                  console.log(`Filter by: ${option.id}`);
                  setDateRange(option.id);
                }}
                data-testid={`filter-${option.id}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {format(new Date(), "MMMM d, yyyy")}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-success" />
            <h2 className="text-lg font-semibold">Today's Collection</h2>
          </div>
          <p className="text-3xl font-bold text-success">${todayCollection.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">4 payments received</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Monthly Collection</h2>
          </div>
          <p className="text-3xl font-bold text-primary">${monthCollection.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="text-sm text-success">↑ 12% from last month</div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold">Pending from Tenants</h2>
          </div>
          <div className="space-y-3">
            {pendingTenants.map((tenant, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="font-medium">{tenant.name}</span>
                <span className="text-warning font-semibold">${tenant.amount}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Pending</span>
              <span className="text-xl font-bold text-warning">
                ${pendingTenants.reduce((sum, t) => sum + t.amount, 0)}
              </span>
            </div>
          </div>
        </Card>

        <Button variant="default" className="w-full" data-testid="button-export-report">
          Export Report
        </Button>
      </div>
    </div>
  );
}
