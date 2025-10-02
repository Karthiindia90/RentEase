import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PaymentCollectionDialog from "@/components/PaymentCollectionDialog";
import { useCurrency } from "@/hooks/use-currency";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  DollarSign,
  Send,
  Receipt,
  Edit,
  RefreshCw,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Plan {
  id: string;
  name: string;
  rate: string;
}

interface Bill {
  id: string;
  amount: string;
  billDate: string;
  dueDate: string;
  status: string;
}

interface Tenant {
  id: string;
  billingName: string;
  phoneNumber: string;
  email: string;
  rentalAddress: string;
  planId?: string;
  plan?: Plan;
  billingType: string;
  billingCycle: string;
  balance: number;
  electricityRate?: string;
  waterRate?: string;
  remarks?: string;
  isActive: boolean;
  bills?: Bill[];
}

interface Payment {
  id: string;
  amount: string;
  paymentDate: string;
  paymentMode: string;
  remarks?: string;
}

export default function TenantDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { symbol } = useCurrency();
  const { toast } = useToast();

  const { data: tenant, isLoading: tenantLoading } = useQuery<Tenant>({
    queryKey: ["/api/tenants", id],
  });

  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ["/api/payments/tenant", id],
  });

  const updateTenantMutation = useMutation({
    mutationFn: async (data: { isActive: boolean }) => {
      return apiRequest("PATCH", `/api/tenants/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenants", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      toast({
        title: "Tenant updated",
        description: "Tenant status has been updated successfully",
      });
    },
  });

  const sendBillMutation = useMutation({
    mutationFn: async () => {
      if (!tenant) {
        throw new Error("Tenant not found");
      }

      const bills = tenant.bills || [];
      const latestBill = bills.sort((a, b) => 
        new Date(b.billDate).getTime() - new Date(a.billDate).getTime()
      )[0];
      
      if (!latestBill) {
        throw new Error("No bill found for this tenant");
      }

      return apiRequest("POST", "/api/messages", {
        tenantId: id,
        content: "Your bill has been sent",
        sender: "admin",
        attachmentType: "bill",
        attachmentId: latestBill.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/tenant", id] });
      toast({
        title: "Bill sent",
        description: "Bill has been sent to the tenant",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send bill",
        variant: "destructive",
      });
    },
  });

  const sendReceiptMutation = useMutation({
    mutationFn: async () => {
      if (!payments || payments.length === 0) {
        throw new Error("No payments found for this tenant");
      }

      const latestPayment = [...payments].sort((a, b) => 
        new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
      )[0];

      return apiRequest("POST", "/api/messages", {
        tenantId: id,
        content: "Your payment receipt has been sent",
        sender: "admin",
        attachmentType: "receipt",
        attachmentId: latestPayment.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/tenant", id] });
      toast({
        title: "Receipt sent",
        description: "Receipt has been sent to the tenant",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send receipt",
        variant: "destructive",
      });
    },
  });

  const renewTenantMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/bills/generate", { tenantId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenants", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
      toast({
        title: "Tenant renewed",
        description: "A new bill has been generated for this tenant",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to renew tenant",
        variant: "destructive",
      });
    },
  });

  if (tenantLoading || !tenant) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const handleToggleActive = (checked: boolean) => {
    updateTenantMutation.mutate({ isActive: checked });
  };

  return (
    <>
      <div className="flex flex-col h-full overflow-auto pb-20">
        <header className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLocation("/tenants")}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Tenant Details</h1>
          </div>
        </header>

        <div className="flex-1 p-4 space-y-4">
          <Card className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">{tenant.billingName}</h2>
                <p className="text-sm text-muted-foreground mb-2">{tenant.rentalAddress}</p>
                <div className="flex items-center gap-3">
                  <Badge className={tenant.isActive ? "bg-success text-white" : "bg-muted"}>
                    {tenant.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="tenant-active" 
                      checked={tenant.isActive}
                      onCheckedChange={handleToggleActive}
                      disabled={updateTenantMutation.isPending}
                      data-testid="switch-active"
                    />
                    <Label htmlFor="tenant-active" className="text-sm cursor-pointer">
                      {tenant.isActive ? "Active" : "Inactive"}
                    </Label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" data-testid="button-call">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" data-testid="button-email">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" data-testid="button-message">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Current Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-xl font-bold text-primary">{tenant.plan?.name || 'No plan'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-xl font-bold">{symbol}{tenant.balance}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="default" 
                className="w-full" 
                data-testid="button-collect-payment"
                onClick={() => setShowPaymentDialog(true)}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Collect Payment
              </Button>
              <Button 
                variant="secondary" 
                className="w-full" 
                data-testid="button-send-bill"
                onClick={() => sendBillMutation.mutate()}
                disabled={sendBillMutation.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Bill
              </Button>
              <Button 
                variant="secondary" 
                className="w-full" 
                data-testid="button-send-receipt"
                onClick={() => sendReceiptMutation.mutate()}
                disabled={sendReceiptMutation.isPending}
              >
                <Receipt className="w-4 h-4 mr-2" />
                Send Receipt
              </Button>
              <Button 
                variant="secondary" 
                className="w-full col-span-2" 
                data-testid="button-renew"
                onClick={() => renewTenantMutation.mutate()}
                disabled={renewTenantMutation.isPending}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Renew Tenant
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="billing">
                <AccordionTrigger>Billing Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Plan</span>
                      <span className="text-sm font-medium">{tenant.plan?.name || 'No plan'}</span>
                    </div>
                    {tenant.plan && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rate</span>
                        <span className="text-sm font-medium">{symbol}{tenant.plan.rate}/month</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Billing Cycle</span>
                      <span className="text-sm font-medium">
                        {tenant.billingCycle === "end_of_month" ? "End of Month" : `Day ${tenant.billingCycle}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Billing Type</span>
                      <span className="text-sm font-medium capitalize">{tenant.billingType}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {(tenant.electricityRate || tenant.waterRate) && (
                <AccordionItem value="utilities">
                  <AccordionTrigger>Utilities</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {tenant.electricityRate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Electricity Rate</span>
                          <span className="text-sm font-medium">{symbol}{tenant.electricityRate}/unit</span>
                        </div>
                      )}
                      {tenant.waterRate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Water Rate</span>
                          <span className="text-sm font-medium">{symbol}{tenant.waterRate}/unit</span>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="contact">
                <AccordionTrigger>Contact Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <span className="text-sm font-medium">{tenant.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <span className="text-sm font-medium">{tenant.email}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {tenant.remarks && (
                <AccordionItem value="remarks">
                  <AccordionTrigger>Remarks</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm pt-2">{tenant.remarks}</p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Payment History</h3>
            <div className="space-y-3">
              {payments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No payments yet</p>
              ) : (
                payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{symbol}{payment.amount}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.paymentDate).toLocaleDateString()} - {payment.paymentMode}
                      </p>
                    </div>
                    {payment.remarks && (
                      <p className="text-xs text-muted-foreground">{payment.remarks}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      <PaymentCollectionDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        tenantId={tenant.id}
        tenantName={tenant.billingName}
        currentBalance={tenant.balance}
      />
    </>
  );
}
