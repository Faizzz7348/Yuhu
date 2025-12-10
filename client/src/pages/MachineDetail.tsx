import { useState } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import MachineHeader from "@/components/MachineHeader";
import MachineStats from "@/components/MachineStats";
import InventoryTable from "@/components/InventoryTable";
import RefillHistory from "@/components/RefillHistory";
import RefillDialog from "@/components/RefillDialog";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockMachines = {
  "M0001": {
    id: "M0001",
    location: "Building A - 1st Floor Lobby",
    status: "needs_refill" as const,
    lastRefill: new Date(2025, 9, 10),
    nextRefill: new Date(2025, 9, 20),
  },
  "M0002": {
    id: "M0002",
    location: "Building B - 2nd Floor Break Room",
    status: "operational" as const,
    lastRefill: new Date(2025, 9, 14),
    nextRefill: new Date(2025, 9, 24),
  },
  "M0003": {
    id: "M0003",
    location: "Building C - Main Lobby",
    status: "maintenance" as const,
    lastRefill: new Date(2025, 9, 8),
    nextRefill: new Date(2025, 9, 18),
  },
  "M0004": {
    id: "M0004",
    location: "Building D - Cafeteria",
    status: "operational" as const,
    lastRefill: new Date(2025, 9, 13),
    nextRefill: new Date(2025, 9, 23),
  },
};

// todo: remove mock functionality
const mockProducts = {
  "M0001": [
    { id: "1", machineId: "M0001", name: "Coca Cola", currentStock: 12, capacity: 50 },
    { id: "2", machineId: "M0001", name: "Pepsi", currentStock: 8, capacity: 50 },
    { id: "3", machineId: "M0001", name: "Sprite", currentStock: 15, capacity: 50 },
    { id: "4", machineId: "M0001", name: "Water", currentStock: 5, capacity: 40 },
    { id: "5", machineId: "M0001", name: "Chips", currentStock: 25, capacity: 30 },
    { id: "6", machineId: "M0001", name: "Candy Bar", currentStock: 18, capacity: 30 },
  ],
  "M0002": [
    { id: "7", machineId: "M0002", name: "Coca Cola", currentStock: 40, capacity: 50 },
    { id: "8", machineId: "M0002", name: "Pepsi", currentStock: 35, capacity: 50 },
    { id: "9", machineId: "M0002", name: "Water", currentStock: 30, capacity: 40 },
    { id: "10", machineId: "M0002", name: "Chips", currentStock: 22, capacity: 30 },
  ],
  "M0003": [
    { id: "11", machineId: "M0003", name: "Coca Cola", currentStock: 20, capacity: 50 },
    { id: "12", machineId: "M0003", name: "Pepsi", currentStock: 25, capacity: 50 },
    { id: "13", machineId: "M0003", name: "Water", currentStock: 15, capacity: 40 },
  ],
  "M0004": [
    { id: "14", machineId: "M0004", name: "Coca Cola", currentStock: 45, capacity: 50 },
    { id: "15", machineId: "M0004", name: "Pepsi", currentStock: 42, capacity: 50 },
    { id: "16", machineId: "M0004", name: "Water", currentStock: 38, capacity: 40 },
    { id: "17", machineId: "M0004", name: "Chips", currentStock: 28, capacity: 30 },
    { id: "18", machineId: "M0004", name: "Candy Bar", currentStock: 25, capacity: 30 },
  ],
};

// todo: remove mock functionality
const mockRefillRecords = {
  "M0001": [
    {
      id: "1",
      date: new Date(2025, 9, 10, 14, 30),
      technician: "John Smith",
      lorry: "LRY-1234",
      notes: "Refilled all slots. Machine operating normally.",
    },
    {
      id: "2",
      date: new Date(2025, 9, 5, 9, 15),
      technician: "Sarah Johnson",
      lorry: "LRY-5678",
      notes: "Partial refill - Coca Cola and Water only.",
    },
    {
      id: "3",
      date: new Date(2025, 9, 1, 11, 0),
      technician: "Mike Davis",
      lorry: "LRY-9012",
      notes: "Full refill completed. Replaced damaged coin mechanism.",
    },
  ],
  "M0002": [
    {
      id: "4",
      date: new Date(2025, 9, 14, 10, 0),
      technician: "Sarah Johnson",
      lorry: "LRY-5678",
      notes: "Regular refill. All products restocked.",
    },
  ],
  "M0003": [
    {
      id: "5",
      date: new Date(2025, 9, 8, 15, 45),
      technician: "Mike Davis",
      lorry: "LRY-9012",
      notes: "Machine needs maintenance. Cooling system issue detected.",
    },
  ],
  "M0004": [
    {
      id: "6",
      date: new Date(2025, 9, 13, 8, 30),
      technician: "John Smith",
      lorry: "LRY-1234",
      notes: "Full refill. Machine performance excellent.",
    },
  ],
};

export default function MachineDetail() {
  const { id } = useParams();
  const machineId = id || "M0001";
  const [refillDialogOpen, setRefillDialogOpen] = useState(false);
  const { toast } = useToast();

  // todo: remove mock functionality - replace with API calls
  const [products, setProducts] = useState(mockProducts[machineId as keyof typeof mockProducts] || []);
  const machine = mockMachines[machineId as keyof typeof mockMachines];
  const refillRecords = mockRefillRecords[machineId as keyof typeof mockRefillRecords] || [];

  if (!machine) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Machine Not Found</h2>
          <p className="text-muted-foreground">The machine ID "{machineId}" does not exist.</p>
        </div>
      </div>
    );
  }

  const handleRefill = (updates: Record<string, number>, deliveryDetails: { name: string; lorry: string; notes: string }) => {
    // Generate current date/time
    const currentDateTime = new Date();
    
    // todo: remove mock functionality - replace with API call
    setProducts(prevProducts =>
      prevProducts.map(product => ({
        ...product,
        currentStock: Math.min(
          product.currentStock + (updates[product.id] || 0),
          product.capacity
        ),
      }))
    );

    toast({
      title: "Refill Complete",
      description: `Successfully updated stock levels for ${machineId} by ${deliveryDetails.name}`,
    });

    console.log("Refill completed:", { 
      machineId, 
      updates, 
      deliveryPerson: deliveryDetails.name,
      lorry: deliveryDetails.lorry,
      notes: deliveryDetails.notes,
      dateTime: currentDateTime.toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Refresh clicked")}
              data-testid="button-refresh"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setRefillDialogOpen(true)}
              data-testid="button-start-refill"
            >
              Start Refill
            </Button>
          </div>
        </div>

        <MachineHeader
          machineId={machine.id}
          location={machine.location}
          status={machine.status}
          lastRefill={machine.lastRefill}
          nextRefill={machine.nextRefill}
        />

        <MachineStats products={products} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InventoryTable products={products} />
          </div>
          <div>
            <RefillHistory records={refillRecords} />
          </div>
        </div>
      </div>

      <RefillDialog
        open={refillDialogOpen}
        onClose={() => setRefillDialogOpen(false)}
        products={products}
        onRefill={handleRefill}
      />
    </div>
  );
}
