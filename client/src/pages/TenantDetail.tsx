import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaymentHistoryItem from "@/components/PaymentHistoryItem";
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
  FileText,
  Upload,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TenantDetail() {
  const [isActive, setIsActive] = useState(true);

  const tenant = {
    name: "John Smith",
    address: "123 Main St, Apt 4B, New York, NY 10001",
    phone: "(555) 123-4567",
    email: "john.smith@email.com",
    plan: "Premium Plan",
    planRate: 800,
    lastBill: 800,
    lastBillDate: new Date("2025-09-01"),
    balance: 0,
    expiryDate: new Date("2025-10-01"),
    securityDeposit: 1600,
    billingCycle: "End of Month",
    billingType: "Prepaid",
    electricityRate: 0.15,
    currentReading: 2450,
    startingReading: 2000,
    waterCharges: 50,
    remarks: "Excellent tenant, always pays on time",
  };

  const paymentHistory = [
    { id: "1", date: new Date("2025-09-01"), amount: 800, mode: "Cash", balance: 0 },
    { id: "2", date: new Date("2025-08-01"), amount: 800, mode: "Online", balance: 800 },
    { id: "3", date: new Date("2025-07-01"), amount: 750, mode: "Check", balance: 1600 },
  ];

  return (
    <div className="flex flex-col h-full overflow-auto pb-20">
      <header className="sticky top-0 bg-background border-b border-border z-10 px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => console.log("Go back")}
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
              <h2 className="text-lg font-semibold mb-1">{tenant.name}</h2>
              <p className="text-sm text-muted-foreground mb-2">{tenant.address}</p>
              <Badge className={isActive ? "bg-success text-white" : "bg-muted"}>
                {isActive ? "Active" : "Inactive"}
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
              <p className="text-sm text-muted-foreground">Last Bill</p>
              <p className="text-xl font-bold text-primary">${tenant.lastBill}</p>
              <p className="text-xs text-muted-foreground">
                {tenant.lastBillDate.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-xl font-bold">${tenant.balance}</p>
              <p className="text-xs text-muted-foreground">
                Expires: {tenant.expiryDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="default" className="w-full" data-testid="button-collect-payment">
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
                    <span className="text-sm font-medium">{tenant.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rate</span>
                    <span className="text-sm font-medium">${tenant.planRate}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Security Deposit</span>
                    <span className="text-sm font-medium">${tenant.securityDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Billing Cycle</span>
                    <span className="text-sm font-medium">{tenant.billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Billing Type</span>
                    <span className="text-sm font-medium">{tenant.billingType}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="utilities">
              <AccordionTrigger>Utilities</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div>
                    <p className="text-sm font-medium mb-2">Electricity</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rate</span>
                        <span className="text-sm">${tenant.electricityRate}/kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Starting Reading</span>
                        <span className="text-sm">{tenant.startingReading} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Reading</span>
                        <span className="text-sm">{tenant.currentReading} kWh</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Water Charges</span>
                    <span className="text-sm font-medium">${tenant.waterCharges}/month</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="documents">
              <AccordionTrigger>Documents</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-3 p-2 rounded-md bg-accent">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm flex-1">Lease Agreement.pdf</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-md bg-accent">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm flex-1">ID Proof.jpg</span>
                  </div>
                  <Button variant="outline" className="w-full mt-2" data-testid="button-upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="remarks">
              <AccordionTrigger>Remarks</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground pt-2">{tenant.remarks}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Payment History</h3>
          <div className="space-y-1">
            {paymentHistory.map((payment) => (
              <PaymentHistoryItem key={payment.id} {...payment} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
