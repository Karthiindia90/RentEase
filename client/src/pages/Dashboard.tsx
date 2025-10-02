import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import MetricCard from "@/components/MetricCard";
import CurrencySelector from "@/components/CurrencySelector";
import { Users, DollarSign, AlertCircle, Clock, Plus, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TenantWithStatus {
  id: string;
  billingName: string;
  status: "paid" | "overdue" | "pending";
  balance: number;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<string | null>(null);

  const { data: tenants = [] } = useQuery<TenantWithStatus[]>({
    queryKey: ["/api/tenants"],
  });

  const { data: todayReport } = useQuery<{ total: number; count: number }>({
    queryKey: ["/api/reports/today"],
  });

  const { data: monthReport } = useQuery<{ total: number; count: number }>({
    queryKey: ["/api/reports/month"],
  });

  const paidCount = tenants.filter(t => t.status === "paid").length;
  const unpaidCount = tenants.filter(t => t.status === "overdue").length;
  const pendingAmount = tenants.reduce((sum, t) => sum + (t.balance > 0 ? t.balance : 0), 0);

  return (
    <div className="flex flex-col h-full overflow-auto pb-20">
      <header className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <CurrencySelector />
        </div>
      </header>

      <div className="flex-1 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            title="Total Tenants"
            value={tenants.length}
            icon={Users}
            color="default"
            onClick={() => {
              console.log('Filter: all tenants');
              setFilter('all');
              setLocation('/tenants');
            }}
          />
          <MetricCard
            title="Paid This Month"
            value={paidCount}
            icon={DollarSign}
            color="success"
            onClick={() => {
              console.log('Filter: paid');
              setFilter('paid');
              setLocation('/tenants');
            }}
          />
          <MetricCard
            title="Unpaid"
            value={unpaidCount}
            icon={AlertCircle}
            color="error"
            onClick={() => {
              console.log('Filter: unpaid');
              setFilter('unpaid');
              setLocation('/tenants');
            }}
          />
          <MetricCard
            title="Pending Amount"
            value={`$${pendingAmount.toFixed(2)}`}
            icon={Clock}
            color="warning"
            onClick={() => {
              console.log('Filter: pending');
              setFilter('pending');
              setLocation('/reports');
            }}
          />
        </div>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="default"
              className="h-auto py-3 flex flex-col gap-1"
              onClick={() => setLocation('/tenants')}
              data-testid="button-collect-payment"
            >
              <DollarSign className="w-5 h-5" />
              <span className="text-sm">Collect Payment</span>
            </Button>
            <Button
              variant="default"
              className="h-auto py-3 flex flex-col gap-1"
              onClick={() => setLocation('/tenants/new')}
              data-testid="button-add-tenant"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">Add Tenant</span>
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-3 flex flex-col gap-1 col-span-2"
              onClick={() => setLocation('/reports')}
              data-testid="button-generate-report"
            >
              <Receipt className="w-5 h-5" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Today's Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Collections</p>
              <p className="text-2xl font-bold text-success">
                ${todayReport?.total?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-muted-foreground">
                {todayReport?.count || 0} payments
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-primary">
                ${monthReport?.total?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-muted-foreground">
                {monthReport?.count || 0} payments
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
