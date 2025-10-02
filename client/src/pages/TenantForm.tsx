import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { useCurrency } from "@/hooks/use-currency";
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
  phoneNumber: z.string().optional(),
  email: z.string().email("Valid email required").or(z.literal("")).optional(),
  rentalAddress: z.string().optional(),
  securityDeposit: z.string().optional(),
  planId: z.string().min(1, "Plan is required"),
  billingType: z.enum(["prepaid", "postpaid"]),
  billingCycle: z.string().min(1, "Billing cycle is required"),
  customBillingDay: z.string().optional(),
  electricityRate: z.string().optional(),
  waterRate: z.string().optional(),
  remarks: z.string().optional(),
}).refine(
  (data) => {
    if (data.billingCycle === "custom") {
      return data.customBillingDay && data.customBillingDay.trim() !== "";
    }
    return true;
  },
  {
    message: "Custom billing day is required when custom cycle is selected",
    path: ["customBillingDay"],
  }
);

type TenantFormValues = z.infer<typeof tenantFormSchema>;

interface Tenant {
  id: string;
  billingName: string;
  phoneNumber?: string;
  email?: string;
  rentalAddress?: string;
  securityDeposit: string;
  planId: string;
  billingType: string;
  billingCycle: string;
  electricityRate?: string;
  waterRate?: string;
  remarks?: string;
}

export default function TenantForm() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { symbol } = useCurrency();
  const [showCustomDay, setShowCustomDay] = useState(false);
  const hasPopulated = useRef(false);
  
  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ["/api/plans"],
  });

  const { data: tenant, isLoading: tenantLoading } = useQuery<Tenant>({
    queryKey: ["/api/tenants", id],
    enabled: isEditing,
  });

  const saveTenantMutation = useMutation({
    mutationFn: async (data: TenantFormValues) => {
      const billingCycle = data.billingCycle === "custom" 
        ? data.customBillingDay 
        : data.billingCycle;
      
      const payload = {
        ...data,
        billingCycle,
        phoneNumber: data.phoneNumber || null,
        email: data.email || null,
        rentalAddress: data.rentalAddress || null,
        securityDeposit: data.securityDeposit || null,
        electricityRate: data.electricityRate || "0",
        waterRate: data.waterRate || "0",
      };

      if (isEditing) {
        return apiRequest("PATCH", `/api/tenants/${id}`, payload);
      }
      return apiRequest("POST", "/api/tenants", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ["/api/tenants", id] });
      }
      toast({
        title: isEditing ? "Tenant updated" : "Tenant created",
        description: isEditing 
          ? "Tenant details have been updated successfully" 
          : "New tenant has been added successfully",
      });
      setLocation(isEditing ? `/tenants/${id}` : "/tenants");
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
      customBillingDay: "",
      electricityRate: "",
      waterRate: "",
      remarks: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditing && tenant && !hasPopulated.current) {
      const isBillingCycleCustom = tenant.billingCycle !== "end_of_month" && tenant.billingCycle !== "1";
      
      form.reset({
        billingName: tenant.billingName,
        phoneNumber: tenant.phoneNumber || "",
        email: tenant.email || "",
        rentalAddress: tenant.rentalAddress || "",
        securityDeposit: tenant.securityDeposit || "",
        planId: tenant.planId,
        billingType: tenant.billingType as "prepaid" | "postpaid",
        billingCycle: isBillingCycleCustom ? "custom" : tenant.billingCycle,
        customBillingDay: isBillingCycleCustom ? tenant.billingCycle : "",
        electricityRate: tenant.electricityRate || "",
        waterRate: tenant.waterRate || "",
        remarks: tenant.remarks || "",
      });
      
      setShowCustomDay(isBillingCycleCustom);
      hasPopulated.current = true;
    }
  }, [isEditing, tenant, form]);

  const onSubmit = (data: TenantFormValues) => {
    saveTenantMutation.mutate(data);
  };

  if (isEditing && tenantLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

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
          <h1 className="text-xl font-semibold">{isEditing ? "Edit Tenant" : "Add Tenant"}</h1>
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
                  <FormLabel>Phone Number (Optional)</FormLabel>
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
                  <FormLabel>Email (Optional)</FormLabel>
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
                  <FormLabel>Address (Optional)</FormLabel>
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
                  <FormLabel>Security Deposit (Optional)</FormLabel>
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
                          {plan.name} - {symbol}{plan.rate}/month
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
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowCustomDay(value === "custom");
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-billing-cycle">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="end_of_month">End of Month</SelectItem>
                      <SelectItem value="1">1st Day of Month</SelectItem>
                      <SelectItem value="custom">Custom Day</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showCustomDay && (
              <FormField
                control={form.control}
                name="customBillingDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Billing Day (1-31)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="1" 
                        max="31" 
                        placeholder="Enter day of month"
                        data-testid="input-custom-day" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
              disabled={saveTenantMutation.isPending}
              data-testid={isEditing ? "button-update-tenant" : "button-create-tenant"}
            >
              {saveTenantMutation.isPending 
                ? (isEditing ? "Updating..." : "Creating...") 
                : (isEditing ? "Update Tenant" : "Create Tenant")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
