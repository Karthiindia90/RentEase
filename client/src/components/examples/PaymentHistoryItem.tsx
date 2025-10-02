import PaymentHistoryItem from '../PaymentHistoryItem';

export default function PaymentHistoryItemExample() {
  return (
    <div className="p-4 max-w-md">
      <PaymentHistoryItem
        id="1"
        date={new Date('2025-09-01')}
        amount={800}
        mode="Cash"
        balance={0}
      />
      <PaymentHistoryItem
        id="2"
        date={new Date('2025-08-01')}
        amount={800}
        mode="Online"
        balance={800}
      />
      <PaymentHistoryItem
        id="3"
        date={new Date('2025-07-01')}
        amount={750}
        mode="Check"
        balance={1600}
      />
    </div>
  );
}
