import { useState } from 'react';
import PaymentCollectionDialog from '../PaymentCollectionDialog';
import { Button } from '@/components/ui/button';

export default function PaymentCollectionDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Payment Dialog</Button>
      <PaymentCollectionDialog
        open={open}
        onOpenChange={setOpen}
        tenantName="John Smith"
        currentBalance={1200}
      />
    </div>
  );
}
