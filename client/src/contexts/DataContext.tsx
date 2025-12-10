import { createContext, useContext, useState, ReactNode } from "react";

interface Route {
  id: string;
  name: string;
  description: string;
  machineCount: number;
  needsRefill: number;
}

interface Machine {
  id: string;
  routeId: string;
  location: string;
  status: string;
  frequency: "Daily" | "Weekday" | "Alt 1" | "Alt 2";
}

interface RefillHistoryItem {
  id: string;
  machineId: string;
  date: string;
  driverName: string;
  assistanceName?: string;
  backupName?: string;
  lorryNumber?: string;
  notes?: string;
  productUpdates: Array<{
    productName: string;
    in: number;
    overflow: number;
    out: number;
    previousStock: number;
    newStock: number;
  }>;
}

interface DataContextType {
  routes: Route[];
  machines: Machine[];
  refillHistory: RefillHistoryItem[];
  updateRoute: (id: string, name: string, description: string) => void;
  updateMachine: (id: string, location: string, frequency: "Daily" | "Weekday" | "Alt 1" | "Alt 2") => void;
  addRefillHistory: (item: RefillHistoryItem) => void;
  getRefillHistoryForMachine: (machineId: string) => RefillHistoryItem[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialRoutes: Route[] = [
  {
    id: "ROUTE-001",
    name: "Route Sel 1",
    description: "Central Business District",
    machineCount: 12,
    needsRefill: 6,
  },
  {
    id: "ROUTE-002",
    name: "Route Sel 2",
    description: "Industrial Area",
    machineCount: 8,
    needsRefill: 3,
  },
  {
    id: "ROUTE-003",
    name: "Route Sel 3",
    description: "Shopping District",
    machineCount: 10,
    needsRefill: 5,
  },
];

const initialMachines: Machine[] = [
  { id: "M0001", routeId: "ROUTE-001", location: "Main Lobby, Building A", status: "needs_refill", frequency: "Daily" },
  { id: "M0002", routeId: "ROUTE-001", location: "Floor 2, Building A", status: "operational", frequency: "Weekday" },
  { id: "M0003", routeId: "ROUTE-001", location: "Cafeteria, Building B", status: "needs_refill", frequency: "Daily" },
  { id: "M0004", routeId: "ROUTE-001", location: "Floor 5, Building B", status: "operational", frequency: "Alt 1" },
  { id: "M0005", routeId: "ROUTE-001", location: "Reception, Building C", status: "needs_refill", frequency: "Daily" },
  { id: "M0006", routeId: "ROUTE-001", location: "Floor 3, Building C", status: "operational", frequency: "Alt 2" },
  { id: "M0007", routeId: "ROUTE-001", location: "Gym Area, Building D", status: "needs_refill", frequency: "Weekday" },
  { id: "M0008", routeId: "ROUTE-001", location: "Conference Room, Building D", status: "operational", frequency: "Daily" },
  { id: "M0009", routeId: "ROUTE-001", location: "Lobby, Building E", status: "needs_refill", frequency: "Alt 1" },
  { id: "M0010", routeId: "ROUTE-001", location: "Floor 4, Building E", status: "operational", frequency: "Alt 2" },
  { id: "M0011", routeId: "ROUTE-001", location: "Food Court, Building F", status: "needs_refill", frequency: "Daily" },
  { id: "M0012", routeId: "ROUTE-001", location: "Rooftop Lounge, Building F", status: "operational", frequency: "Weekday" },
  { id: "M0013", routeId: "ROUTE-002", location: "Factory Floor 1", status: "needs_refill", frequency: "Daily" },
  { id: "M0014", routeId: "ROUTE-002", location: "Factory Floor 2", status: "operational", frequency: "Weekday" },
  { id: "M0015", routeId: "ROUTE-002", location: "Warehouse A", status: "needs_refill", frequency: "Alt 1" },
  { id: "M0016", routeId: "ROUTE-002", location: "Warehouse B", status: "operational", frequency: "Alt 2" },
  { id: "M0017", routeId: "ROUTE-002", location: "Office Block", status: "needs_refill", frequency: "Daily" },
  { id: "M0018", routeId: "ROUTE-002", location: "Loading Bay", status: "operational", frequency: "Weekday" },
  { id: "M0019", routeId: "ROUTE-002", location: "Staff Canteen", status: "operational", frequency: "Daily" },
  { id: "M0020", routeId: "ROUTE-002", location: "Security Gate", status: "operational", frequency: "Alt 1" },
  { id: "M0021", routeId: "ROUTE-003", location: "Mall Entrance", status: "needs_refill", frequency: "Daily" },
  { id: "M0022", routeId: "ROUTE-003", location: "Food Court Level 1", status: "operational", frequency: "Weekday" },
  { id: "M0023", routeId: "ROUTE-003", location: "Food Court Level 2", status: "needs_refill", frequency: "Alt 1" },
  { id: "M0024", routeId: "ROUTE-003", location: "Cinema Level 3", status: "operational", frequency: "Alt 2" },
  { id: "M0025", routeId: "ROUTE-003", location: "Department Store", status: "needs_refill", frequency: "Daily" },
  { id: "M0026", routeId: "ROUTE-003", location: "Parking Level B1", status: "operational", frequency: "Weekday" },
  { id: "M0027", routeId: "ROUTE-003", location: "Parking Level B2", status: "needs_refill", frequency: "Alt 1" },
  { id: "M0028", routeId: "ROUTE-003", location: "Gaming Zone", status: "operational", frequency: "Alt 2" },
  { id: "M0029", routeId: "ROUTE-003", location: "Kids Play Area", status: "needs_refill", frequency: "Daily" },
  { id: "M0030", routeId: "ROUTE-003", location: "Rooftop Garden", status: "operational", frequency: "Weekday" },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [refillHistory, setRefillHistory] = useState<RefillHistoryItem[]>([]);

  const updateRoute = (id: string, name: string, description: string) => {
    setRoutes(prev =>
      prev.map(route =>
        route.id === id ? { ...route, name, description } : route
      )
    );
  };

  const updateMachine = (id: string, location: string, frequency: "Daily" | "Weekday" | "Alt 1" | "Alt 2") => {
    setMachines(prev =>
      prev.map(machine =>
        machine.id === id ? { ...machine, location, frequency } : machine
      )
    );
  };

  const addRefillHistory = (item: RefillHistoryItem) => {
    setRefillHistory(prev => [item, ...prev]);
  };

  const getRefillHistoryForMachine = (machineId: string) => {
    return refillHistory.filter(item => item.machineId === machineId);
  };

  return (
    <DataContext.Provider value={{ 
      routes, 
      machines, 
      refillHistory,
      updateRoute, 
      updateMachine,
      addRefillHistory,
      getRefillHistoryForMachine
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
