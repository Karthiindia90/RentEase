import { Badge } from "@/components/ui/badge";

interface FilterChip {
  id: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  filters: FilterChip[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export default function FilterChips({ filters, activeFilter, onFilterChange }: FilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <Badge
            key={filter.id}
            variant={isActive ? "default" : "secondary"}
            className="cursor-pointer whitespace-nowrap hover-elevate active-elevate-2"
            onClick={() => onFilterChange(filter.id)}
            data-testid={`filter-${filter.id}`}
          >
            {filter.label}
            {filter.count !== undefined && ` (${filter.count})`}
          </Badge>
        );
      })}
    </div>
  );
}
