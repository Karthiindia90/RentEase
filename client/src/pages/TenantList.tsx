import { useState } from "react";
import TenantCard from "@/components/TenantCard";
import FilterChips from "@/components/FilterChips";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockTenants = [
  {
    id: "1",
    name: "John Smith",
    address: "123 Main St, Apt 4B",
    status: "paid" as const,
    lastPaymentDate: new Date("2025-09-15"),
    balance: 0,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    address: "456 Oak Ave, Unit 2",
    status: "overdue" as const,
    lastPaymentDate: new Date("2025-08-20"),
    balance: 1200,
  },
  {
    id: "3",
    name: "Michael Brown",
    address: "789 Pine Rd, Suite 12",
    status: "pending" as const,
    lastPaymentDate: new Date("2025-09-25"),
    balance: 850,
  },
  {
    id: "4",
    name: "Emily Davis",
    address: "321 Elm St, Apt 1A",
    status: "paid" as const,
    lastPaymentDate: new Date("2025-09-10"),
    balance: 0,
  },
  {
    id: "5",
    name: "David Wilson",
    address: "654 Maple Dr, Unit 5",
    status: "overdue" as const,
    lastPaymentDate: new Date("2025-08-15"),
    balance: 950,
  },
];

export default function TenantList() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { id: "all", label: "All", count: 24 },
    { id: "paid", label: "Paid", count: 18 },
    { id: "unpaid", label: "Unpaid", count: 4 },
    { id: "due-this-month", label: "Due This Month", count: 6 },
  ];

  const filteredTenants = mockTenants.filter((tenant) => {
    if (activeFilter === "paid" && tenant.status !== "paid") return false;
    if (activeFilter === "unpaid" && tenant.status !== "overdue") return false;
    if (searchQuery && !tenant.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden pb-20">
      <header className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">Tenants</h1>
          <Button size="icon" data-testid="button-add-tenant" onClick={() => console.log('Add tenant')}>
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
        {filteredTenants.map((tenant) => (
          <TenantCard
            key={tenant.id}
            {...tenant}
            onClick={() => console.log(`View tenant ${tenant.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
