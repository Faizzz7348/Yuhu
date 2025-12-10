import RefillHistory from '../RefillHistory';

export default function RefillHistoryExample() {
  const records = [
    {
      id: "1",
      date: new Date(2025, 9, 10, 14, 30),
      technician: "John Smith",
      notes: "Refilled all slots. Machine operating normally."
    },
    {
      id: "2",
      date: new Date(2025, 9, 5, 9, 15),
      technician: "Sarah Johnson",
      notes: "Partial refill - Coca Cola and Water only."
    }
  ];

  return <RefillHistory records={records} />;
}
