import PlanCard from '../PlanCard';

export default function PlanCardExample() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <PlanCard
        id="1"
        name="Basic Plan"
        rate={500}
        onEdit={() => console.log('Edit plan 1')}
      />
      <PlanCard
        id="2"
        name="Premium Plan"
        rate={800}
        onEdit={() => console.log('Edit plan 2')}
      />
      <PlanCard
        id="3"
        name="Deluxe Plan"
        rate={1200}
        onEdit={() => console.log('Edit plan 3')}
      />
    </div>
  );
}
