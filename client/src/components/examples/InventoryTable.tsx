import InventoryTable from '../InventoryTable';

export default function InventoryTableExample() {
  const products = [
    { id: "1", machineId: "M0001", name: "Coca Cola", currentStock: 35, capacity: 50 },
    { id: "2", machineId: "M0001", name: "Pepsi", currentStock: 12, capacity: 50 },
    { id: "3", machineId: "M0001", name: "Water", currentStock: 8, capacity: 40 },
    { id: "4", machineId: "M0001", name: "Chips", currentStock: 25, capacity: 30 },
  ];

  return <InventoryTable products={products} />;
}
