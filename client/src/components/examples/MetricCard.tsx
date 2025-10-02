import MetricCard from '../MetricCard';
import { Users, DollarSign, AlertCircle, Clock } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <MetricCard title="Total Tenants" value="24" icon={Users} color="default" />
      <MetricCard title="Paid This Month" value="18" icon={DollarSign} color="success" />
      <MetricCard title="Unpaid" value="4" icon={AlertCircle} color="error" />
      <MetricCard title="Pending Amount" value="$2,450" icon={Clock} color="warning" />
    </div>
  );
}
