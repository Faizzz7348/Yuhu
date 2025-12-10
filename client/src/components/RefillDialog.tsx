import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, Clock } from "lucide-react";
import type { Product } from "@shared/schema";
import { useData } from "@/contexts/DataContext";
import { format } from "date-fns";

interface RefillDialogProps {
  open: boolean;
  onClose: () => void;
  machineId: string;
  products: Product[];
  onRefill: (
    updates: Record<string, number>, 
    deliveryDetails: { name: string; assistance: string; backup: string; lorry: string; notes: string },
    quantities: Record<string, ProductQuantities>
  ) => void;
  deliveryName?: string;
  assistanceName?: string;
  backupName?: string;
  lorryNumber?: string;
}

type ColumnType = 'in' | 'overflow' | 'out';

interface ProductQuantities {
  in: number;
  overflow: number;
  out: number;
}

export default function RefillDialog({ open, onClose, machineId, products, onRefill, deliveryName = "", assistanceName = "", backupName = "", lorryNumber = "" }: RefillDialogProps) {
  const { getRefillHistoryForMachine } = useData();
  const [productQuantities, setProductQuantities] = useState<Record<string, ProductQuantities>>({});
  const [selectedColumn, setSelectedColumn] = useState<Record<string, ColumnType | null>>({});
  const [notes, setNotes] = useState("");
  const [refillCode, setRefillCode] = useState("");
  
  const refillHistory = getRefillHistoryForMachine(machineId);

  const handleQuickFill = () => {
    const code = refillCode.toUpperCase().trim();
    
    if (!code) return;

    // FULL - Fill all products to full capacity
    if (code === "FULL" || code === "F") {
      const newQuantities: Record<string, ProductQuantities> = {};
      products.forEach(product => {
        const needed = product.capacity - product.currentStock;
        if (needed > 0) {
          newQuantities[product.id] = { in: needed, overflow: 0, out: 0 };
        }
      });
      setProductQuantities(newQuantities);
      setRefillCode("");
      return;
    }

    // HALF - Fill all products to 50% capacity
    if (code === "HALF" || code === "H") {
      const newQuantities: Record<string, ProductQuantities> = {};
      products.forEach(product => {
        const target = Math.ceil(product.capacity / 2);
        const needed = target - product.currentStock;
        if (needed > 0) {
          newQuantities[product.id] = { in: needed, overflow: 0, out: 0 };
        }
      });
      setProductQuantities(newQuantities);
      setRefillCode("");
      return;
    }

    // CLEAR - Reset all quantities to 0
    if (code === "CLEAR" || code === "C") {
      setProductQuantities({});
      setRefillCode("");
      return;
    }

    // Number code - Fill all with specific quantity (e.g., "3" fills all with 3)
    const numValue = parseInt(code);
    if (!isNaN(numValue) && numValue >= 0) {
      const newQuantities: Record<string, ProductQuantities> = {};
      products.forEach(product => {
        newQuantities[product.id] = { in: numValue, overflow: 0, out: 0 };
      });
      setProductQuantities(newQuantities);
      setRefillCode("");
      return;
    }
  };

  const handleColumnChange = (productId: string, column: ColumnType, value: number, product: Product) => {
    const newValue = Math.max(0, value);
    
    setProductQuantities(prev => {
      const current = prev[productId] || { in: 0, overflow: 0, out: 0 };
      const updated = { ...current, [column]: newValue };
      
      // Auto-calculate overflow when total stock exceeds capacity
      // Overflow acts as a subtraction to cap the final stock at max capacity
      const totalStock = product.currentStock + updated.in - updated.out;
      if (totalStock > product.capacity) {
        updated.overflow = totalStock - product.capacity;
      } else {
        updated.overflow = 0;
      }
      
      return { ...prev, [productId]: updated };
    });
  };

  const handleColumnSelect = (productId: string, column: ColumnType) => {
    setSelectedColumn(prev => ({ ...prev, [productId]: column }));
  };

  const handleColumnDeselect = (productId: string) => {
    setSelectedColumn(prev => ({ ...prev, [productId]: null }));
  };

  const handleButtonClick = (productId: string, delta: number, product: Product) => {
    const column = selectedColumn[productId];
    if (!column) return;
    
    const quantities = productQuantities[productId] || { in: 0, overflow: 0, out: 0 };
    const currentValue = quantities[column];
    handleColumnChange(productId, column, currentValue + delta, product);
  };

  const handleCancel = () => {
    setProductQuantities({});
    setSelectedColumn({});
    setNotes("");
    onClose();
  };

  const handleSubmit = () => {
    const isBackup = backupName && backupName.trim();
    const activeName = isBackup ? backupName : deliveryName;
    
    if (!activeName.trim()) {
      alert("Please enter name");
      return;
    }
    
    // Convert to net stock changes (in - out - overflow)
    const updates: Record<string, number> = {};
    Object.entries(productQuantities).forEach(([productId, quantities]) => {
      updates[productId] = quantities.in - quantities.out - quantities.overflow;
    });
    
    onRefill(
      updates, 
      { 
        name: deliveryName.trim(), 
        assistance: assistanceName.trim(), 
        backup: backupName.trim(), 
        lorry: lorryNumber.trim(), 
        notes: notes.trim() 
      },
      productQuantities
    );
    setProductQuantities({});
    setSelectedColumn({});
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto glass-card" data-testid="dialog-refill">
        <DialogHeader>
          <DialogTitle className="text-base">Refill Machine</DialogTitle>
          <DialogDescription className="text-xs">
            Update the stock quantities for each product
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {(deliveryName || backupName) && (
            <div className="pb-4 border-b">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">{backupName && backupName.trim() ? "Backup" : "Driver"}:</span>
                <span className="font-medium">{backupName && backupName.trim() ? backupName : deliveryName}</span>
                {lorryNumber && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">Lorry:</span>
                    <span className="font-medium">{lorryNumber}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Quick Fill Section */}
          <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-3 bg-blue-500/5">
            <Label className="text-xs font-semibold mb-2 block">⚡ Quick Fill</Label>
            <div className="flex gap-2">
              <Input
                placeholder="FULL, HALF, CLEAR, or number (e.g., 3)"
                value={refillCode}
                onChange={(e) => setRefillCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleQuickFill();
                  }
                }}
                className="flex-1"
                data-testid="input-refill-code"
              />
              <Button 
                onClick={handleQuickFill}
                size="sm"
                variant="secondary"
                data-testid="button-apply-refill-code"
              >
                Apply
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <span className="font-mono font-semibold">FULL</span> = Fill to max | 
              <span className="font-mono font-semibold ml-1">HALF</span> = Fill to 50% | 
              <span className="font-mono font-semibold ml-1">3</span> = Add 3 to all | 
              <span className="font-mono font-semibold ml-1">CLEAR</span> = Reset
            </p>
          </div>

          <h3 className="font-medium text-sm">Stock Quantities</h3>
          {products.map((product) => {
            const quantities = productQuantities[product.id] || { in: 0, overflow: 0, out: 0 };
            const selected = selectedColumn[product.id];
            const isButtonEnabled = !!selected;
            const calculatedStock = product.currentStock + quantities.in - quantities.out - quantities.overflow;
            
            return (
              <div key={product.id} className="space-y-2" data-testid={`refill-item-${product.id}`}>
                <Label className="text-xs truncate block">{product.name}</Label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleButtonClick(product.id, -1, product)}
                      disabled={!isButtonEnabled || (quantities[selected!] || 0) <= 0}
                      data-testid={`button-decrease-${product.id}`}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleButtonClick(product.id, 1, product)}
                      disabled={!isButtonEnabled}
                      data-testid={`button-increase-${product.id}`}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs flex-1">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        placeholder="0"
                        value={quantities.in || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          handleColumnChange(product.id, 'in', parseInt(val) || 0, product);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E' || e.key === '.') {
                            e.preventDefault();
                          }
                        }}
                        onClick={() => handleColumnSelect(product.id, 'in')}
                        onFocus={() => handleColumnSelect(product.id, 'in')}
                        onBlur={() => handleColumnDeselect(product.id)}
                        className="w-16 text-center font-mono text-green-600 dark:text-green-400"
                        data-testid={`input-in-${product.id}`}
                      />
                      <Input
                        type="number"
                        placeholder="0"
                        value={quantities.overflow || ''}
                        className="w-16 text-center font-mono text-blue-600 dark:text-blue-400"
                        data-testid={`input-overflow-${product.id}`}
                        readOnly
                      />
                      <Input
                        type="number"
                        placeholder="0"
                        value={quantities.out || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          handleColumnChange(product.id, 'out', parseInt(val) || 0, product);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E' || e.key === '.') {
                            e.preventDefault();
                          }
                        }}
                        onClick={() => handleColumnSelect(product.id, 'out')}
                        onFocus={() => handleColumnSelect(product.id, 'out')}
                        onBlur={() => handleColumnDeselect(product.id)}
                        className="w-16 text-center font-mono text-red-600 dark:text-red-400"
                        data-testid={`input-out-${product.id}`}
                      />
                    </div>
                    
                    <span className="text-muted-foreground">→</span>
                    <span className="text-muted-foreground">{product.currentStock}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="font-medium" data-testid={`text-calculated-${product.id}`}>{calculatedStock}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-muted-foreground">{product.capacity}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this refill..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-testid="input-notes"
            />
          </div>

          {refillHistory.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <Label className="text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Past Refills
              </Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {refillHistory.map((refill) => (
                  <div 
                    key={refill.id} 
                    className="glass-card p-3 space-y-2"
                    data-testid={`refill-history-${refill.id}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium truncate">{refill.driverName}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {format(new Date(refill.date), "MMM d, h:mm a")}
                      </span>
                    </div>
                    
                    {refill.notes && (
                      <p className="text-xs text-muted-foreground italic">{refill.notes}</p>
                    )}
                    
                    <div className="text-xs space-y-1">
                      {refill.productUpdates.map((update, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2">
                          <span className="truncate text-muted-foreground">{update.productName}</span>
                          <span className="shrink-0 font-mono">
                            <span className="text-green-600 dark:text-green-400">{update.in > 0 ? `+${update.in}` : ''}</span>
                            {update.overflow > 0 && (
                              <span className="text-blue-600 dark:text-blue-400 ml-1">-{update.overflow}</span>
                            )}
                            {update.out > 0 && (
                              <span className="text-red-600 dark:text-red-400 ml-1">-{update.out}</span>
                            )}
                            {update.in === 0 && update.overflow === 0 && update.out === 0 && (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSubmit} data-testid="button-complete-refill">
            Complete Refill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
