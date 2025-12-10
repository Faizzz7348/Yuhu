import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus, Minus, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Product list - same as refill page
const AVAILABLE_PRODUCTS = [
  "Chicken Slice X",
  "Mayo Sandwich",
  "Double Chicken Slice",
  "Chicken Floss Sandwich",
  "Sardines Sandwich",
  "Kani Mayo",
  "Classic Tuna Sandwich",
  "Spicy Tuna Sandwich",
  "Big Bite",
  "Double Egg Mayo",
  "Tuna Mayo",
  "Chicken Mayo",
  "Egg Sandwich",
  "Ham & Cheese",
  "Vegetable Sandwich",
];

interface ProductQuantity {
  productName: string;
  quantity: number;
}

export default function DeliveryOrder() {
  const [orderNumber, setOrderNumber] = useState(`DO-${Date.now().toString().slice(-8)}`);
  const [routeName, setRouteName] = useState("");
  const [machineName, setMachineName] = useState("");
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleQuantityChange = (productName: string, value: string) => {
    const qty = parseInt(value) || 0;
    if (qty === 0) {
      const newQuantities = { ...productQuantities };
      delete newQuantities[productName];
      setProductQuantities(newQuantities);
    } else if (qty > 0) {
      setProductQuantities(prev => ({
        ...prev,
        [productName]: qty
      }));
    }
  };

  const handleQuantityAdjust = (productName: string, delta: number) => {
    const currentQty = productQuantities[productName] || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    if (newQty === 0) {
      const newQuantities = { ...productQuantities };
      delete newQuantities[productName];
      setProductQuantities(newQuantities);
    } else {
      setProductQuantities(prev => ({
        ...prev,
        [productName]: newQty
      }));
    }
  };

  const handleSubmitOrder = () => {
    if (!routeName.trim()) {
      toast({
        title: "Error",
        description: "Please enter route name",
        variant: "destructive",
      });
      return;
    }

    if (!machineName.trim()) {
      toast({
        title: "Error",
        description: "Please enter machine name",
        variant: "destructive",
      });
      return;
    }

    const orderItems = Object.entries(productQuantities).map(([productName, quantity]) => ({
      productName,
      quantity
    }));

    if (orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      orderNumber,
      routeName,
      machineName,
      items: orderItems,
      notes,
      timestamp: new Date().toISOString(),
    };

    console.log("Delivery Order submitted:", orderData);

    toast({
      title: "Order Submitted!",
      description: `Order ${orderNumber} has been created successfully`,
    });

    // Reset form and generate new order number
    const newOrderNumber = `DO-${Date.now().toString().slice(-8)}`;
    setOrderNumber(newOrderNumber);
    setRouteName("");
    setMachineName("");
    setProductQuantities({});
    setNotes("");
  };

  const totalItems = Object.values(productQuantities).reduce((sum, qty) => sum + qty, 0);
  const selectedProductCount = Object.keys(productQuantities).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Package className="w-5 h-5" />
                New Delivery Order
              </CardTitle>
              {totalItems > 0 && (
                <Badge className="text-sm px-3 py-1">
                  {totalItems} Items
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Delivery Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Delivery Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order-number" className="text-xs">Order Number</Label>
                  <Input
                    id="order-number"
                    value={orderNumber}
                    disabled
                    className="bg-muted font-mono font-semibold"
                    data-testid="input-order-number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="route-name" className="text-xs">Route Name *</Label>
                  <Input
                    id="route-name"
                    placeholder="e.g., Route A, Route B"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    data-testid="input-route-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machine-name" className="text-xs">Machine Name *</Label>
                  <Input
                    id="machine-name"
                    placeholder="e.g., M0001, M0002"
                    value={machineName}
                    onChange={(e) => setMachineName(e.target.value.toUpperCase())}
                    data-testid="input-machine-name"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add New Item */}
        <Card className="glass-card border-2 border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Product List</CardTitle>
              {selectedProductCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedProductCount} Selected
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {AVAILABLE_PRODUCTS.map((product) => {
                const quantity = productQuantities[product] || 0;
                const isSelected = quantity > 0;
                  
                  return (
                    <div
                      key={product}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-all ${
                        isSelected 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'bg-card hover:bg-accent/50'
                      }`}
                      data-testid={`product-item-${product}`}
                    >
                      <div className="flex-1">
                        <Label 
                          htmlFor={`qty-${product}`} 
                          className={`text-sm cursor-pointer ${isSelected ? 'font-semibold' : ''}`}
                        >
                          {product}
                        </Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => handleQuantityAdjust(product, -1)}
                          disabled={quantity === 0}
                          data-testid={`button-decrease-${product}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <Input
                          id={`qty-${product}`}
                          type="number"
                          placeholder="0"
                          value={quantity || ''}
                          onChange={(e) => handleQuantityChange(product, e.target.value)}
                          className="w-16 text-center font-mono"
                          data-testid={`input-qty-${product}`}
                        />
                        
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => handleQuantityAdjust(product, 1)}
                          data-testid={`button-increase-${product}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>        {/* Order Summary - Only show if items selected */}
        {selectedProductCount > 0 && (
          <Card className="glass-card bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(productQuantities)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([productName, quantity]) => (
                    <div
                      key={productName}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{productName}</span>
                      <span className="font-mono font-semibold">x{quantity}</span>
                    </div>
                  ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total Items</span>
                    <span className="font-mono">{totalItems}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any special instructions or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              data-testid="input-notes"
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card className="glass-card border-2 border-primary/20">
          <CardContent className="p-4">
            <Button
              onClick={handleSubmitOrder}
              className="w-full text-sm h-10"
              size="lg"
              disabled={selectedProductCount === 0}
              data-testid="button-submit-order"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit Delivery Order ({totalItems} Items)
            </Button>
            {selectedProductCount === 0 && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Add at least one item to submit
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
