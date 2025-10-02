import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import PlanCard from "@/components/PlanCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Plan } from "@shared/schema";

export default function Plans() {
  const [open, setOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planRate, setPlanRate] = useState("");
  const { symbol } = useCurrency();

  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  const createPlanMutation = useMutation({
    mutationFn: async (data: { name: string; rate: string }) => {
      return apiRequest("POST", "/api/plans", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      setOpen(false);
      setPlanName("");
      setPlanRate("");
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPlanMutation.mutate({ name: planName, rate: planRate });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

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
                  <Label htmlFor="plan-rate">Monthly Rate ({symbol})</Label>
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
                <Button 
                  type="submit" 
                  className="w-full" 
                  data-testid="button-save-plan"
                  disabled={createPlanMutation.isPending}
                >
                  {createPlanMutation.isPending ? "Creating..." : "Create Plan"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-3">
        {plans.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No plans yet. Create one to get started!
          </div>
        ) : (
          plans.map((plan) => (
            <PlanCard
              key={plan.id}
              id={plan.id}
              name={plan.name}
              rate={parseFloat(plan.rate)}
              onEdit={() => console.log(`Edit plan ${plan.id}`)}
              onDelete={() => deletePlanMutation.mutate(plan.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
