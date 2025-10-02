import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import TenantCard from "@/components/TenantCard";
import FilterChips from "@/components/FilterChips";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TenantWithStatus {
  id: string;
  billingName: string;
  rentalAddress: string;
  status: "paid" | "overdue" | "pending";
  lastPaymentDate: Date | null;
  balance: number;
}

export default function TenantList() {
  const [, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tenants = [], isLoading } = useQuery<TenantWithStatus[]>({
    queryKey: ["/api/tenants"],
  });

  const filters = [
    { id: "all", label: "All", count: tenants.length },
    { id: "paid", label: "Paid", count: tenants.filter(t => t.status === "paid").length },
    { id: "unpaid", label: "Unpaid", count: tenants.filter(t => t.status === "overdue").length },
    { id: "due-this-month", label: "Due This Month", count: tenants.filter(t => t.status === "pending").length },
  ];

  const filteredTenants = tenants.filter((tenant) => {
    if (activeFilter === "paid" && tenant.status !== "paid") return false;
    if (activeFilter === "unpaid" && tenant.status !== "overdue") return false;
    if (activeFilter === "due-this-month" && tenant.status !== "pending") return false;
    if (searchQuery && !tenant.billingName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden pb-20">
      <header className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">Tenants</h1>
          <Button 
            size="icon" 
            data-testid="button-add-tenant" 
            onClick={() => setLocation("/tenants/new")}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tenants..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-tenants"
          />
        </div>
        <FilterChips
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {filteredTenants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {tenants.length === 0 ? "No tenants yet. Add one to get started!" : "No tenants match your search."}
          </div>
        ) : (
          filteredTenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              id={tenant.id}
              name={tenant.billingName}
              address={tenant.rentalAddress}
              status={tenant.status}
              lastPaymentDate={tenant.lastPaymentDate ? new Date(tenant.lastPaymentDate) : new Date()}
              balance={tenant.balance}
              onClick={() => setLocation(`/tenants/${tenant.id}`)}
              onPaymentCollect={() => console.log(`Collect payment for ${tenant.id}`)}
              onViewHistory={() => setLocation(`/tenants/${tenant.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
