import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle } from "lucide-react";
import type { Product } from "@shared/schema";

interface MachineStatsProps {
  products: Product[];
}

export default function MachineStats({ products }: MachineStatsProps) {
  const totalCapacity = products.reduce((sum, p) => sum + p.capacity, 0);
  const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
  const stockPercentage = Math.round((totalStock / totalCapacity) * 100);
  const lowStockItems = products.filter(p => (p.currentStock / p.capacity) < 0.3).length;

  const stats = [
    {
      title: "Total Stock",
      value: `${totalStock} / ${totalCapacity}`,
      icon: Package,
      description: "Items in machine",
      testId: "total-stock"
    },
    {
      title: "Capacity Used",
      value: `${stockPercentage}%`,
      icon: TrendingUp,
      description: "Overall fill level",
      testId: "capacity-used"
    },
    {
      title: "Low Stock Items",
      value: lowStockItems,
      icon: AlertTriangle,
      description: "Needs attention",
      testId: "low-stock-items"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="glass-card transform hover:scale-105" data-testid={`card-stat-${stat.testId}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid={`text-${stat.testId}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
