import MachineStats from '../MachineStats';

export default function MachineStatsExample() {
  const products = [
    { id: "1", machineId: "M0001", name: "Coca Cola", currentStock: 35, capacity: 50 },
    { id: "2", machineId: "M0001", name: "Pepsi", currentStock: 12, capacity: 50 },
    { id: "3", machineId: "M0001", name: "Water", currentStock: 8, capacity: 40 },
  ];

  return <MachineStats products={products} />;
}
