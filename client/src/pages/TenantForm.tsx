import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Plan {
  id: string;
  name: string;
  rate: string;
}

const tenantFormSchema = z.object({
  billingName: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  rentalAddress: z.string().min(1, "Address is required"),
  securityDeposit: z.string().min(1, "Security deposit is required"),
  planId: z.string().min(1, "Plan is required"),
  billingType: z.enum(["prepaid", "postpaid"]),
  billingCycle: z.string().min(1, "Billing cycle is required"),
  electricityRate: z.string().optional(),
  waterRate: z.string().optional(),
  remarks: z.string().optional(),
});

type TenantFormValues = z.infer<typeof tenantFormSchema>;

export default function TenantForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  const createTenantMutation = useMutation({
    mutationFn: async (data: TenantFormValues) => {
      return apiRequest("POST", "/api/tenants", {
        ...data,
        electricityRate: data.electricityRate || "0",
        waterRate: data.waterRate || "0",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      toast({
        title: "Tenant created",
        description: "New tenant has been added successfully",
      });
      setLocation("/tenants");
    },
  });

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      billingName: "",
      phoneNumber: "",
      email: "",
      rentalAddress: "",
      securityDeposit: "",
      planId: "",
      billingType: "postpaid",
      billingCycle: "end_of_month",
      electricityRate: "",
      waterRate: "",
      remarks: "",
    },
  });

  const onSubmit = (data: TenantFormValues) => {
    createTenantMutation.mutate(data);
  };

  return (
    <div className="flex flex-col h-full overflow-auto pb-20">
      <header className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/tenants")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Add Tenant</h1>
        </div>
      </header>

      <div className="flex-1 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="billingName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Name</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-tenant-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" data-testid="input-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" data-testid="input-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rentalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} data-testid="input-address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="securityDeposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Security Deposit</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" data-testid="input-security-deposit" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="planId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-plan">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - ${plan.rate}/month
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-billing-type">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="prepaid">Prepaid</SelectItem>
                      <SelectItem value="postpaid">Postpaid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Cycle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-billing-cycle">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="end_of_month">End of Month</SelectItem>
                      {[1, 5, 10, 15, 20, 25].map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          Day {day} of each month
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="electricityRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Electricity Rate (per unit) - Optional</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" data-testid="input-electricity-rate" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="waterRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Water Rate (per unit) - Optional</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" data-testid="input-water-rate" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks - Optional</FormLabel>
                  <FormControl>
                    <Textarea {...field} data-testid="input-remarks" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={createTenantMutation.isPending}
              data-testid="button-create-tenant"
            >
              {createTenantMutation.isPending ? "Creating..." : "Create Tenant"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
