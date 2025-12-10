import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

const machines = [
  { id: "M0001", location: "Building A - 1st Floor" },
  { id: "M0002", location: "Building B - 2nd Floor" },
  { id: "M0003", location: "Building C - Main Lobby" },
  { id: "M0004", location: "Building D - Cafeteria" },
];

export default function MachineSelector({ currentMachineId }: { currentMachineId: string }) {
  const [, setLocation] = useLocation();

  return (
    <Select value={currentMachineId} onValueChange={(value) => setLocation(`/refill-service/${value}`)}>
      <SelectTrigger className="w-[280px]" data-testid="select-machine">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {machines.map((machine) => (
          <SelectItem key={machine.id} value={machine.id} data-testid={`option-machine-${machine.id}`}>
            {machine.id} - {machine.location}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
