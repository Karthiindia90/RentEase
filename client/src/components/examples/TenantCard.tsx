import TenantCard from '../TenantCard';

export default function TenantCardExample() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <TenantCard
        id="1"
        name="John Smith"
        address="123 Main St, Apt 4B"
        status="paid"
        lastPaymentDate={new Date('2025-09-15')}
        balance={0}
        onClick={() => console.log('Tenant clicked')}
      />
      <TenantCard
        id="2"
        name="Sarah Johnson"
        address="456 Oak Ave, Unit 2"
        status="overdue"
        lastPaymentDate={new Date('2025-08-20')}
        balance={1200}
        onClick={() => console.log('Tenant clicked')}
      />
      <TenantCard
        id="3"
        name="Michael Brown"
        address="789 Pine Rd, Suite 12"
        status="pending"
        lastPaymentDate={new Date('2025-09-25')}
        balance={850}
        onClick={() => console.log('Tenant clicked')}
      />
    </div>
  );
}
