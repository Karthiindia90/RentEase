import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaymentCollectionDialog from "@/components/PaymentCollectionDialog";
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

  const { data: tenant, isLoading: tenantLoading } = useQuery<Tenant>({
    queryKey: ["/api/tenants", id],
  });

  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ["/api/payments/tenant", id],
  });

  if (tenantLoading || !tenant) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const isActive = tenant.balance === 0;

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
                <Badge className={isActive ? "bg-success text-white" : "bg-muted"}>
                  {isActive ? "Active" : "Pending"}
                </Badge>
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
                <p className="text-xl font-bold">${tenant.balance}</p>
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
              <Button variant="secondary" className="w-full" data-testid="button-send-bill">
                <Send className="w-4 h-4 mr-2" />
                Send Bill
              </Button>
              <Button variant="secondary" className="w-full" data-testid="button-send-receipt">
                <Receipt className="w-4 h-4 mr-2" />
                Send Receipt
              </Button>
              <Button variant="secondary" className="w-full" data-testid="button-change-balance">
                <Edit className="w-4 h-4 mr-2" />
                Change Balance
              </Button>
              <Button variant="secondary" className="w-full col-span-2" data-testid="button-renew">
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
                        <span className="text-sm font-medium">${tenant.plan.rate}/month</span>
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
                          <span className="text-sm font-medium">${tenant.electricityRate}/unit</span>
                        </div>
                      )}
                      {tenant.waterRate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Water Rate</span>
                          <span className="text-sm font-medium">${tenant.waterRate}/unit</span>
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
                      <p className="text-sm font-medium">${payment.amount}</p>
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
