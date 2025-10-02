import { useState } from 'react';
import FilterChips from '../FilterChips';

export default function FilterChipsExample() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'All', count: 24 },
    { id: 'paid', label: 'Paid', count: 18 },
    { id: 'unpaid', label: 'Unpaid', count: 4 },
    { id: 'due-this-month', label: 'Due This Month', count: 6 },
  ];

  return (
    <div className="p-4">
      <FilterChips 
        filters={filters} 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />
    </div>
  );
}
