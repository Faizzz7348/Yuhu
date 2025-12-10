import MachineHeader from '../MachineHeader';

export default function MachineHeaderExample() {
  return (
    <div className="p-4">
      <MachineHeader
        machineId="M0001"
        location="Building A - 1st Floor Lobby"
        status="needs_refill"
        lastRefill={new Date(2025, 9, 10)}
        nextRefill={new Date(2025, 9, 20)}
      />
    </div>
  );
}
