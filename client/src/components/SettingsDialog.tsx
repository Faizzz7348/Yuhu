import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Route {
  id: string;
  name: string;
  description: string;
}

interface Machine {
  id: string;
  routeId: string;
  location: string;
  frequency: "Daily" | "Weekday" | "Alt 1" | "Alt 2";
}

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  routes: Route[];
  machines: Machine[];
  onUpdateRoute: (id: string, name: string, description: string) => void;
  onUpdateMachine: (id: string, location: string, frequency: "Daily" | "Weekday" | "Alt 1" | "Alt 2") => void;
}

export default function SettingsDialog({
  open,
  onClose,
  routes,
  machines,
  onUpdateRoute,
  onUpdateMachine,
}: SettingsDialogProps) {
  const [editingRoute, setEditingRoute] = useState<string | null>(null);
  const [editingMachine, setEditingMachine] = useState<string | null>(null);
  const [routeName, setRouteName] = useState("");
  const [routeDesc, setRouteDesc] = useState("");
  const [machineLocation, setMachineLocation] = useState("");
  const [machineFrequency, setMachineFrequency] = useState<"Daily" | "Weekday" | "Alt 1" | "Alt 2">("Daily");
  const { toast } = useToast();

  const handleEditRoute = (route: Route) => {
    setEditingRoute(route.id);
    setRouteName(route.name);
    setRouteDesc(route.description || "");
  };

  const handleSaveRoute = (routeId: string) => {
    if (!routeName.trim()) {
      toast({
        title: "Error",
        description: "Route name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onUpdateRoute(routeId, routeName.trim(), routeDesc.trim());
    setEditingRoute(null);
    toast({
      title: "Route Updated",
      description: "Route information has been saved",
    });
  };

  const handleEditMachine = (machine: Machine) => {
    setEditingMachine(machine.id);
    setMachineLocation(machine.location);
    setMachineFrequency(machine.frequency);
  };

  const handleSaveMachine = (machineId: string) => {
    if (!machineLocation.trim()) {
      toast({
        title: "Error",
        description: "Machine location cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onUpdateMachine(machineId, machineLocation.trim(), machineFrequency);
    setEditingMachine(null);
    toast({
      title: "Machine Updated",
      description: "Machine information has been saved",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto glass-card" data-testid="dialog-settings">
        <DialogHeader>
          <DialogTitle className="text-base">Settings</DialogTitle>
          <DialogDescription className="text-xs">
            Edit route names and machine locations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Routes Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Routes</h3>
            <div className="space-y-3">
              {routes.map((route) => (
                <div key={route.id} className="border rounded-md p-3 space-y-3">
                  {editingRoute === route.id ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor={`route-name-${route.id}`} className="text-xs">
                          Route Name
                        </Label>
                        <Input
                          id={`route-name-${route.id}`}
                          value={routeName}
                          onChange={(e) => setRouteName(e.target.value)}
                          className="text-xs"
                          data-testid={`input-route-name-${route.id}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`route-desc-${route.id}`} className="text-xs">
                          Description
                        </Label>
                        <Input
                          id={`route-desc-${route.id}`}
                          value={routeDesc}
                          onChange={(e) => setRouteDesc(e.target.value)}
                          className="text-xs"
                          data-testid={`input-route-desc-${route.id}`}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveRoute(route.id)}
                          className="text-xs"
                          data-testid={`button-save-route-${route.id}`}
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingRoute(null)}
                          className="text-xs"
                          data-testid={`button-cancel-route-${route.id}`}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm" data-testid={`text-route-name-${route.id}`}>
                          {route.name}
                        </div>
                        <div className="text-xs text-muted-foreground" data-testid={`text-route-desc-${route.id}`}>
                          {route.description}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditRoute(route)}
                        className="text-xs"
                        data-testid={`button-edit-route-${route.id}`}
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Machines Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Machines</h3>
            <div className="space-y-3">
              {machines.map((machine) => (
                <div key={machine.id} className="border rounded-md p-3">
                  {editingMachine === machine.id ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`machine-id-${machine.id}`} className="text-xs">
                          Machine ID
                        </Label>
                        <Input
                          id={`machine-id-${machine.id}`}
                          value={machine.id}
                          disabled
                          className="text-xs font-mono bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`machine-location-${machine.id}`} className="text-xs">
                          Location
                        </Label>
                        <Input
                          id={`machine-location-${machine.id}`}
                          value={machineLocation}
                          onChange={(e) => setMachineLocation(e.target.value)}
                          className="text-xs"
                          data-testid={`input-machine-location-${machine.id}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`machine-frequency-${machine.id}`} className="text-xs">
                          Frequency
                        </Label>
                        <Select
                          value={machineFrequency}
                          onValueChange={(value: "Daily" | "Weekday" | "Alt 1" | "Alt 2") => setMachineFrequency(value)}
                        >
                          <SelectTrigger className="text-xs" data-testid={`select-machine-frequency-${machine.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Daily" className="text-xs">Daily</SelectItem>
                            <SelectItem value="Weekday" className="text-xs">Weekday</SelectItem>
                            <SelectItem value="Alt 1" className="text-xs">Alt 1</SelectItem>
                            <SelectItem value="Alt 2" className="text-xs">Alt 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveMachine(machine.id)}
                          className="text-xs"
                          data-testid={`button-save-machine-${machine.id}`}
                        >
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingMachine(null)}
                          className="text-xs"
                          data-testid={`button-cancel-machine-${machine.id}`}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-mono font-medium text-sm" data-testid={`text-machine-id-${machine.id}`}>
                            {machine.id}
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {machine.frequency}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground" data-testid={`text-machine-location-${machine.id}`}>
                          {machine.location}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditMachine(machine)}
                        className="text-xs"
                        data-testid={`button-edit-machine-${machine.id}`}
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
