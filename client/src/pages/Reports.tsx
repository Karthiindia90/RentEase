import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { useCurrency } from "@/hooks/use-currency";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface PendingReport {
  total: number;
  tenants: Array<{
    tenantId: string;
    tenantName: string;
    pending: number;
  }>;
}

export default function Reports() {
  const [dateRange, setDateRange] = useState("today");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const { symbol } = useCurrency();

  const dateRangeOptions = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "custom", label: "Custom" },
  ];

  // Determine the API endpoint based on selected date range
  const getReportEndpoint = () => {
    if (dateRange === "custom" && customDateRange?.from && customDateRange?.to) {
      const startDate = format(customDateRange.from, "yyyy-MM-dd");
      const endDate = format(customDateRange.to, "yyyy-MM-dd");
      return `/api/reports/custom?startDate=${startDate}&endDate=${endDate}`;
    }
    return `/api/reports/${dateRange}`;
  };

  const { data: report } = useQuery<{ total: number; count: number }>({
    queryKey: [getReportEndpoint()],
    enabled: dateRange !== "custom" || (customDateRange?.from !== undefined && customDateRange?.to !== undefined),
  });

  const { data: pendingReport } = useQuery<PendingReport>({
    queryKey: ["/api/reports/pending"],
  });

  const collection = report?.total || 0;
  const paymentCount = report?.count || 0;
  const pendingTenants = pendingReport?.tenants || [];

  // Get display text for date range
  const getDateRangeText = () => {
    const now = new Date();
    switch (dateRange) {
      case "today":
        return format(now, "MMMM d, yyyy");
      case "week":
        const weekStart = startOfWeek(now, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
      case "month":
        return format(now, "MMMM yyyy");
      case "custom":
        if (customDateRange?.from && customDateRange?.to) {
          return `${format(customDateRange.from, "MMM d")} - ${format(customDateRange.to, "MMM d, yyyy")}`;
        }
        return "Select date range";
      default:
        return format(now, "MMMM d, yyyy");
    }
  };

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
                  setDateRange(option.id);
                }}
                data-testid={`filter-${option.id}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
          {dateRange === "custom" && (
            <div className="mt-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full" data-testid="button-custom-date-picker">
                    {customDateRange?.from ? (
                      customDateRange.to ? (
                        <>
                          {format(customDateRange.from, "LLL dd, y")} -{" "}
                          {format(customDateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(customDateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={customDateRange?.from}
                    selected={customDateRange}
                    onSelect={setCustomDateRange}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {getDateRangeText()}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-success" />
            <h2 className="text-lg font-semibold">Collection</h2>
          </div>
          <p className="text-3xl font-bold text-success">{symbol}{collection.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {paymentCount} payments received
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold">Pending from Tenants</h2>
          </div>
          {pendingTenants.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending payments</p>
          ) : (
            <>
              <div className="space-y-3">
                {pendingTenants.map((tenant, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="font-medium">{tenant.tenantName}</span>
                    <span className="text-warning font-semibold">{symbol}{tenant.pending.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Pending</span>
                  <span className="text-xl font-bold text-warning">
                    {symbol}{pendingReport?.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </Card>

        <Button variant="default" className="w-full" data-testid="button-export-report">
          Export Report
        </Button>
      </div>
    </div>
  );
}
