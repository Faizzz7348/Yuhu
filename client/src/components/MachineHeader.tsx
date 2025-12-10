import { MapPin, Calendar } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { format } from "date-fns";

interface MachineHeaderProps {
  machineId: string;
  location: string;
  status: "operational" | "needs_refill" | "maintenance";
  lastRefill?: Date;
  nextRefill?: Date;
}

export default function MachineHeader({
  machineId,
  location,
  status,
  lastRefill,
  nextRefill
}: MachineHeaderProps) {
  return (
    <div className="space-y-4" data-testid="machine-header">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold font-mono" data-testid="text-machine-id">
          {machineId}
        </h1>
        <StatusBadge status={status} />
      </div>
      
      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2" data-testid="text-location">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        
        {lastRefill && (
          <div className="flex items-center gap-2" data-testid="text-last-refill">
            <Calendar className="w-4 h-4" />
            <span>Last refill: {format(lastRefill, "MMM d, yyyy")}</span>
          </div>
        )}
        
        {nextRefill && (
          <div className="flex items-center gap-2" data-testid="text-next-refill">
            <Calendar className="w-4 h-4" />
            <span>Next refill: {format(nextRefill, "MMM d, yyyy")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
