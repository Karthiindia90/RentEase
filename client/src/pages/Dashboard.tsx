import { useState } from "react";
import MetricCard from "@/components/MetricCard";
import CurrencySelector from "@/components/CurrencySelector";
import { Users, DollarSign, AlertCircle, Clock, Plus, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const [filter, setFilter] = useState<string | null>(null);

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
            value="24"
            icon={Users}
            color="default"
            onClick={() => {
              console.log('Filter: all tenants');
              setFilter('all');
            }}
          />
          <MetricCard
            title="Paid This Month"
            value="18"
            icon={DollarSign}
            color="success"
            onClick={() => {
              console.log('Filter: paid');
              setFilter('paid');
            }}
          />
          <MetricCard
            title="Unpaid"
            value="4"
            icon={AlertCircle}
            color="error"
            onClick={() => {
              console.log('Filter: unpaid');
              setFilter('unpaid');
            }}
          />
          <MetricCard
            title="Pending Amount"
            value="$2,450"
            icon={Clock}
            color="warning"
            onClick={() => {
              console.log('Filter: pending');
              setFilter('pending');
            }}
          />
        </div>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="default"
              className="h-auto py-3 flex flex-col gap-1"
              onClick={() => console.log('Collect payment')}
              data-testid="button-collect-payment"
            >
              <DollarSign className="w-5 h-5" />
              <span className="text-sm">Collect Payment</span>
            </Button>
            <Button
              variant="default"
              className="h-auto py-3 flex flex-col gap-1"
              onClick={() => console.log('Add tenant')}
              data-testid="button-add-tenant"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">Add Tenant</span>
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-3 flex flex-col gap-1 col-span-2"
              onClick={() => console.log('Generate report')}
              data-testid="button-generate-report"
            >
              <Receipt className="w-5 h-5" />
              <span className="text-sm">Generate Report</span>
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium">John Smith</p>
                <p className="text-sm text-muted-foreground">Payment received - $800</p>
              </div>
              <p className="text-xs text-muted-foreground">2h ago</p>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Payment overdue</p>
              </div>
              <p className="text-xs text-muted-foreground">1d ago</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Michael Brown</p>
                <p className="text-sm text-muted-foreground">New tenant added</p>
              </div>
              <p className="text-xs text-muted-foreground">3d ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
