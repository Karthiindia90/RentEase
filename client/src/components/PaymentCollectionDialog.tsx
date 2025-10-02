import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Printer, Mail, MessageSquare } from "lucide-react";

interface PaymentCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantName: string;
  currentBalance: number;
}

export default function PaymentCollectionDialog({
  open,
  onOpenChange,
  tenantName,
  currentBalance,
}: PaymentCollectionDialogProps) {
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [remarks, setRemarks] = useState("");

  const calculatedBalance = currentBalance - (parseFloat(amount) || 0) + (parseFloat(discount) || 0);

  const handleSubmit = () => {
    console.log("Payment collected:", {
      amount,
      discount,
      paymentMode,
      remarks,
      newBalance: calculatedBalance,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Collect Payment - {tenantName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-accent rounded-md">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-2xl font-bold">${currentBalance.toFixed(2)}</p>
          </div>

          <div>
            <Label htmlFor="amount">Payment Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              data-testid="input-payment-amount"
            />
          </div>

          <div>
            <Label htmlFor="discount">Discount (Optional) ($)</Label>
            <Input
              id="discount"
              type="number"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Enter discount"
              data-testid="input-discount"
            />
          </div>

          <div className="p-3 bg-primary/10 rounded-md">
            <p className="text-sm text-muted-foreground">New Balance</p>
            <p className="text-2xl font-bold text-primary">
              ${calculatedBalance.toFixed(2)}
            </p>
          </div>

          <div>
            <Label htmlFor="payment-mode">Payment Mode</Label>
            <Select value={paymentMode} onValueChange={setPaymentMode}>
              <SelectTrigger id="payment-mode" data-testid="select-payment-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="online">Online Transfer</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Payment Date</Label>
            <Input
              id="date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              data-testid="input-payment-date"
            />
          </div>

          <div>
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any notes..."
              data-testid="input-remarks"
            />
          </div>

          <div className="space-y-2">
            <Button className="w-full" onClick={handleSubmit} data-testid="button-save-payment">
              Save Payment
            </Button>
            
            <div className="grid grid-cols-3 gap-2">
              <Button variant="secondary" size="sm" data-testid="button-print">
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
              <Button variant="secondary" size="sm" data-testid="button-send-sms">
                <MessageSquare className="w-4 h-4 mr-1" />
                SMS
              </Button>
              <Button variant="secondary" size="sm" data-testid="button-send-email">
                <Mail className="w-4 h-4 mr-1" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
