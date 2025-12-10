import { useState } from 'react';
import RefillDialog from '../RefillDialog';
import { Button } from '@/components/ui/button';

export default function RefillDialogExample() {
  const [open, setOpen] = useState(false);
  
  const products = [
    { id: "1", machineId: "M0001", name: "Coca Cola", currentStock: 35, capacity: 50 },
    { id: "2", machineId: "M0001", name: "Pepsi", currentStock: 12, capacity: 50 },
  ];

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Refill Dialog</Button>
      <RefillDialog
        open={open}
        onClose={() => setOpen(false)}
        products={products}
        onRefill={(updates, notes) => console.log('Refill:', updates, notes)}
      />
    </div>
  );
}
