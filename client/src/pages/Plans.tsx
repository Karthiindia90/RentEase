import { useState } from "react";
import PlanCard from "@/components/PlanCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockPlans = [
  { id: "1", name: "Basic Plan", rate: 500 },
  { id: "2", name: "Standard Plan", rate: 700 },
  { id: "3", name: "Premium Plan", rate: 800 },
  { id: "4", name: "Deluxe Plan", rate: 1200 },
];

export default function Plans() {
  const [open, setOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planRate, setPlanRate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create plan:", { name: planName, rate: planRate });
    setOpen(false);
    setPlanName("");
    setPlanRate("");
  };

  return (
    <div className="flex flex-col h-full overflow-auto pb-20">
      <header className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Plans</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="icon" data-testid="button-add-plan">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Plan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="plan-name">Plan Name</Label>
                  <Input
                    id="plan-name"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="Enter plan name"
                    data-testid="input-plan-name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="plan-rate">Monthly Rate ($)</Label>
                  <Input
                    id="plan-rate"
                    type="number"
                    step="0.01"
                    value={planRate}
                    onChange={(e) => setPlanRate(e.target.value)}
                    placeholder="Enter monthly rate"
                    data-testid="input-plan-rate"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="button-save-plan">
                  Create Plan
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-3">
        {mockPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            {...plan}
            onEdit={() => console.log(`Edit plan ${plan.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
