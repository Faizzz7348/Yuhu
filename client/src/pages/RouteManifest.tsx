import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Truck, MapPin, Package, CheckCircle2, AlertCircle, ChevronRight, Calendar, Clock, Gauge, Save } from "lucide-react";
import RefillDialog from "@/components/RefillDialog";
import type { Machine, Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { MachineCardSkeleton } from "@/components/LoadingSkeleton";

// Mock reference data for auto-fill
const mockReferenceData: Record<string, {
  role: "driver" | "backup";
  name: string;
  lorry?: string;
  assistant?: string;
}> = {
  "REF001": {
    role: "driver",
    name: "Ahmad Abdullah",
    lorry: "WXY1234",
    assistant: "Faiz Ali"
  },
  "REF002": {
    role: "driver",
    name: "Siti Nurhaliza",
    lorry: "ABC5678",
  },
  "REF003": {
    role: "backup",
    name: "Hassan Ibrahim",
    lorry: "DEF9012",
  },
  "DRV001": {
    role: "driver",
    name: "Muhammad Hafiz",
    lorry: "GHI3456",
    assistant: "Nora Ismail"
  },
  "BAK001": {
    role: "backup",
    name: "Azman Yusof",
    lorry: "JKL7890",
  },
};

const mockProducts: Record<string, Product[]> = {
  "M0001": [
    { id: "1", machineId: "M0001", name: "Chicken Slice X", currentStock: 5, capacity: 6 },
    { id: "2", machineId: "M0001", name: "Mayo Sandwich", currentStock: 3, capacity: 6 },
    { id: "3", machineId: "M0001", name: "Double Chicken Slice", currentStock: 2, capacity: 6 },
    { id: "4", machineId: "M0001", name: "Chicken Floss Sandwich", currentStock: 2, capacity: 6 },
    { id: "5", machineId: "M0001", name: "Sardines Sandwich", currentStock: 4, capacity: 6 },
    { id: "6", machineId: "M0001", name: "Kani Mayo", currentStock: 5, capacity: 6 },
    { id: "7", machineId: "M0001", name: "Classic Tuna Sandwich", currentStock: 3, capacity: 6 },
    { id: "8", machineId: "M0001", name: "Spicy Tuna Sandwich", currentStock: 5, capacity: 6 },
    { id: "9", machineId: "M0001", name: "Big Bite", currentStock: 3, capacity: 6 },
    { id: "10", machineId: "M0001", name: "Double Egg Mayo", currentStock: 4, capacity: 6 },
  ],
  // Similar products for other machines
};

export default function RouteManifest() {
  const { id } = useParams();
  const routeId = id || "ROUTE-001";
  const { routes, machines: allMachines, addRefillHistory, isLoading } = useData();
  const route = routes.find((r) => r.id === routeId);
  const machines = allMachines.filter((m) => m.routeId === routeId);
  
  const [referenceNumber, setReferenceNumber] = useState("");
  const [driverOrBackup, setDriverOrBackup] = useState("driver"); // "driver" or "backup"
  const [driverName, setDriverName] = useState("");
  const [backupName, setBackupName] = useState("");
  const [hasAssistant, setHasAssistant] = useState("no");
  const [assistanceName, setAssistanceName] = useState("");
  const [lorryNumber, setLorryNumber] = useState("");
  const [odometerStart, setOdometerStart] = useState("");
  const [odometerEnd, setOdometerEnd] = useState("");
  const [savedOdometer, setSavedOdometer] = useState<{ start: string; end: string } | null>(null);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [completedMachines, setCompletedMachines] = useState<Set<string>>(new Set());
  const [machineProducts, setMachineProducts] = useState<Record<string, Product[]>>({});
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReferenceNumberApply = () => {
    const refData = mockReferenceData[referenceNumber.toUpperCase()];
    
    if (!refData) {
      toast({
        title: "Invalid Reference",
        description: "Reference number not found. Try: REF001, REF002, REF003, DRV001, BAK001",
        variant: "destructive",
      });
      return;
    }

    // Auto-fill all fields
    setDriverOrBackup(refData.role);
    if (refData.role === "driver") {
      setDriverName(refData.name);
      setBackupName("");
    } else {
      setBackupName(refData.name);
      setDriverName("");
    }
    
    if (refData.lorry) {
      setLorryNumber(refData.lorry);
    }
    
    if (refData.assistant) {
      setHasAssistant("yes");
      setAssistanceName(refData.assistant);
    } else {
      setHasAssistant("no");
      setAssistanceName("");
    }

    toast({
      title: "Data Loaded",
      description: `${refData.role === "driver" ? "Driver" : "Backup"}: ${refData.name}`,
    });
  };

  const handleSaveOdometer = () => {
    if (!odometerStart.trim() || !odometerEnd.trim()) {
      toast({
        title: "Error",
        description: "Please enter both start and end odometer readings",
        variant: "destructive",
      });
      return;
    }

    const start = parseFloat(odometerStart);
    const end = parseFloat(odometerEnd);

    if (isNaN(start) || isNaN(end)) {
      toast({
        title: "Error",
        description: "Please enter valid numbers",
        variant: "destructive",
      });
      return;
    }

    if (end < start) {
      toast({
        title: "Error",
        description: "End odometer reading must be greater than start reading",
        variant: "destructive",
      });
      return;
    }

    setSavedOdometer({ start: odometerStart, end: odometerEnd });
    toast({
      title: "Odometer Saved",
      description: `Distance: ${(end - start).toFixed(1)} km. You can edit anytime.`,
    });

    console.log("Odometer readings saved:", {
      start: odometerStart,
      end: odometerEnd,
      distance: end - start,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSubmitAll = () => {
    // Validate all required fields
    const activeName = driverOrBackup === "driver" ? driverName : backupName;
    
    if (!activeName.trim()) {
      toast({
        title: "Error",
        description: `Please enter ${driverOrBackup} name`,
        variant: "destructive",
      });
      return;
    }

    if (completedMachines.size === 0) {
      toast({
        title: "Error",
        description: "Please refill at least one machine",
        variant: "destructive",
      });
      return;
    }

    if (!savedOdometer) {
      toast({
        title: "Warning",
        description: "Please save odometer readings before submitting",
        variant: "destructive",
      });
      return;
    }

    // Submit all data
    console.log("Submitting complete route:", {
      route: route?.id,
      role: driverOrBackup,
      name: activeName,
      assistant: assistanceName,
      lorry: lorryNumber,
      odometer: savedOdometer,
      completedMachines: Array.from(completedMachines),
      timestamp: new Date().toISOString(),
    });

    toast({
      title: "Success!",
      description: `Route ${route?.name} completed successfully!`,
    });

    // Here you would typically send data to backend
    // For now, just show success message
  };

  const handleStartRefill = (machineId: string) => {
    const activeName = driverOrBackup === "driver" ? driverName : backupName;
    
    if (!activeName.trim()) {
      toast({
        title: `${driverOrBackup === "driver" ? "Driver" : "Backup"} Name Required`,
        description: `Please enter ${driverOrBackup} name first`,
        variant: "destructive",
      });
      return;
    }

    // Initialize products for machine if not already loaded
    if (!machineProducts[machineId]) {
      setMachineProducts(prev => ({
        ...prev,
        [machineId]: mockProducts["M0001"].map(p => ({ ...p, machineId }))
      }));
    }

    setSelectedMachine(machineId);
  };

  const handleRefill = (
    updates: Record<string, number>, 
    deliveryDetails: { name: string; assistance: string; backup: string; lorry: string; notes: string },
    quantities: Record<string, { in: number; overflow: number; out: number }>
  ) => {
    if (!selectedMachine) return;

    const currentDateTime = new Date();
    const currentProducts = machineProducts[selectedMachine] || [];
    
    // Build product updates for history using actual quantities
    const productUpdates = currentProducts.map(product => {
      const netChange = updates[product.id] || 0;
      const newStock = Math.min(product.currentStock + netChange, product.capacity);
      const productQuantities = quantities[product.id] || { in: 0, overflow: 0, out: 0 };
      
      return {
        productName: product.name,
        in: productQuantities.in,
        overflow: productQuantities.overflow,
        out: productQuantities.out,
        previousStock: product.currentStock,
        newStock: newStock,
      };
    });

    // Add to refill history
    addRefillHistory({
      id: `REFILL-${Date.now()}`,
      machineId: selectedMachine,
      date: currentDateTime.toISOString(),
      driverName: driverOrBackup === "driver" ? deliveryDetails.name : "",
      assistanceName: deliveryDetails.assistance,
      backupName: driverOrBackup === "backup" ? deliveryDetails.backup : "",
      lorryNumber: deliveryDetails.lorry,
      notes: deliveryDetails.notes,
      productUpdates,
    });
    
    setMachineProducts(prev => ({
      ...prev,
      [selectedMachine]: prev[selectedMachine]?.map(product => ({
        ...product,
        currentStock: Math.min(
          product.currentStock + (updates[product.id] || 0),
          product.capacity
        ),
      })) || []
    }));

    setCompletedMachines(prev => new Set(prev).add(selectedMachine));

    toast({
      title: "Machine Refilled",
      description: `${selectedMachine} completed by ${deliveryDetails.name}`,
    });

    console.log("Refill completed:", {
      machineId: selectedMachine,
      updates,
      driver: deliveryDetails.name,
      assistance: deliveryDetails.assistance,
      backup: deliveryDetails.backup,
      lorry: deliveryDetails.lorry,
      notes: deliveryDetails.notes,
      dateTime: currentDateTime.toISOString(),
    });

    setSelectedMachine(null);
  };

  const getFrequencyBadge = (machineId: string) => {
    const machine = machines.find(m => m.id === machineId);
    if (!machine) return null;

    const frequencyColors = {
      "Daily": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      "Weekday": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      "Alt 1": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      "Alt 2": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    };

    return (
      <Badge 
        className={`${frequencyColors[machine.frequency]} text-xs`}
        data-testid={`badge-frequency-${machineId}`}
      >
        {machine.frequency}
      </Badge>
    );
  };

  const progressCount = completedMachines.size;
  const totalMachines = machines.length;

  if (!route) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Route not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Route Header */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-lg font-bold">{route.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{route.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{currentDateTime.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{currentDateTime.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <Badge className="text-sm px-3 py-0.5" data-testid="badge-progress">
                {progressCount} / {totalMachines}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Fill Section */}
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 bg-primary/5">
              <Label className="text-xs font-semibold mb-2 block">Quick Fill - Enter Reference Number</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., REF001, DRV001, BAK001"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleReferenceNumberApply();
                    }
                  }}
                  className="flex-1"
                  data-testid="input-reference-number"
                />
                <Button 
                  onClick={handleReferenceNumberApply}
                  size="sm"
                  data-testid="button-apply-reference"
                >
                  Apply
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Available codes: <span className="font-mono font-semibold">REF001</span>, <span className="font-mono font-semibold">REF002</span>, <span className="font-mono font-semibold">REF003</span>, <span className="font-mono font-semibold">DRV001</span>, <span className="font-mono font-semibold">BAK001</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-xs font-semibold">Select Role *</Label>
                <RadioGroup value={driverOrBackup} onValueChange={(value) => {
                  setDriverOrBackup(value);
                  // Clear the other field when switching
                  if (value === "driver") {
                    setBackupName("");
                  } else {
                    setDriverName("");
                  }
                }} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="driver" id="role-driver" data-testid="radio-role-driver" />
                    <Label htmlFor="role-driver" className="text-xs font-normal cursor-pointer">Driver</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="backup" id="role-backup" data-testid="radio-role-backup" />
                    <Label htmlFor="role-backup" className="text-xs font-normal cursor-pointer">Backup</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {driverOrBackup === "driver" ? (
                  <div className="space-y-2">
                    <Label htmlFor="driver-name" className="text-xs">Driver Name *</Label>
                    <Input
                      id="driver-name"
                      placeholder="Enter driver name"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      data-testid="input-driver-name"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="backup-name" className="text-xs">Backup Name *</Label>
                    <Input
                      id="backup-name"
                      placeholder="Enter backup name"
                      value={backupName}
                      onChange={(e) => setBackupName(e.target.value)}
                      data-testid="input-backup-name"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="lorry-number" className="text-xs">Lorry Number</Label>
                  <Input
                    id="lorry-number"
                    placeholder="Enter lorry number"
                    value={lorryNumber}
                    onChange={(e) => setLorryNumber(e.target.value)}
                    data-testid="input-lorry-number"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold">Assistant Option</Label>
                  <RadioGroup value={hasAssistant} onValueChange={(value) => {
                    setHasAssistant(value);
                    if (value === "no") setAssistanceName("");
                  }} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="assistant-yes" data-testid="radio-assistant-yes" />
                      <Label htmlFor="assistant-yes" className="text-xs font-normal cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="assistant-no" data-testid="radio-assistant-no" />
                      <Label htmlFor="assistant-no" className="text-xs font-normal cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                  {hasAssistant === "yes" && (
                    <Input
                      id="assistance-name"
                      placeholder="Enter assistant name"
                      value={assistanceName}
                      onChange={(e) => setAssistanceName(e.target.value)}
                      data-testid="input-assistance-name"
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-4 h-4" />
                <Label className="text-xs font-semibold">Odometer Reading</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="odometer-start" className="text-xs">Start (km)</Label>
                  <Input
                    id="odometer-start"
                    type="number"
                    placeholder="0"
                    value={odometerStart}
                    onChange={(e) => setOdometerStart(e.target.value)}
                    data-testid="input-odometer-start"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="odometer-end" className="text-xs">End (km)</Label>
                  <Input
                    id="odometer-end"
                    type="number"
                    placeholder="0"
                    value={odometerEnd}
                    onChange={(e) => setOdometerEnd(e.target.value)}
                    data-testid="input-odometer-end"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs opacity-0">Action</Label>
                  <Button
                    onClick={handleSaveOdometer}
                    className="w-full text-xs"
                    size="sm"
                    variant={savedOdometer ? "outline" : "default"}
                    data-testid="button-save-odometer"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    {savedOdometer ? "Update" : "Save"}
                  </Button>
                </div>
              </div>
              {savedOdometer && (
                <div className="mt-3 text-xs text-muted-foreground">
                  Distance: {(parseFloat(savedOdometer.end) - parseFloat(savedOdometer.start)).toFixed(1)} km
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Machines List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Package className="w-4 h-4" />
            Machines to Refill
          </h2>
          
          {isLoading ? (
            <div className="space-y-3">
              <MachineCardSkeleton />
              <MachineCardSkeleton />
              <MachineCardSkeleton />
            </div>
          ) : (
            <div className="space-y-3">
              {machines.map((machine) => (
              <Card
                key={machine.id}
                className={`glass-card transition-all duration-200 ${
                  completedMachines.has(machine.id) ? 'opacity-75' : 'hover:shadow-lg'
                }`}
                data-testid={`card-machine-${machine.id}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-semibold text-sm" data-testid={`text-machine-id-${machine.id}`}>
                          {machine.id}
                        </span>
                        {getFrequencyBadge(machine.id)}
                        {completedMachines.has(machine.id) && (
                          <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate" data-testid={`text-location-${machine.id}`}>
                          {machine.location}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleStartRefill(machine.id)}
                      disabled={completedMachines.has(machine.id)}
                      data-testid={`button-refill-${machine.id}`}
                      className="shrink-0 text-xs h-8"
                      size="sm"
                    >
                      {completedMachines.has(machine.id) ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Done
                        </>
                      ) : (
                        <>
                          Refill
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}

          {/* Submit Button */}
          {!isLoading && machines.length > 0 && (
            <Card className="glass-card border-2 border-primary/20">
              <CardContent className="p-4">
                <Button
                  onClick={handleSubmitAll}
                  className="w-full text-sm h-10"
                  size="lg"
                  disabled={completedMachines.size === 0}
                  data-testid="button-submit-route"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit Route ({completedMachines.size}/{machines.length} Completed)
                </Button>
                {completedMachines.size === 0 && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Complete at least one machine to submit
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Refill Dialog */}
      {selectedMachine && machineProducts[selectedMachine] && (
        <RefillDialog
          open={!!selectedMachine}
          onClose={() => setSelectedMachine(null)}
          machineId={selectedMachine}
          products={machineProducts[selectedMachine]}
          deliveryName={driverOrBackup === "driver" ? driverName : backupName}
          assistanceName={assistanceName}
          backupName={driverOrBackup === "backup" ? backupName : ""}
          lorryNumber={lorryNumber}
          onRefill={(updates, details, quantities) => handleRefill(updates, details, quantities)}
        />
      )}
    </div>
  );
}
