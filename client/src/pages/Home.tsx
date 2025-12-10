import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, ChevronRight, Package } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { RouteCardSkeleton } from "@/components/LoadingSkeleton";

export default function Home() {
  const [, setLocation] = useLocation();
  const { routes, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-40 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="h-4 w-56 bg-muted animate-pulse rounded" />
                </div>
                <div className="w-5 h-5 bg-muted animate-pulse rounded" />
              </div>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RouteCardSkeleton />
            <RouteCardSkeleton />
            <RouteCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight" data-testid="text-page-title">Delivery Routes</h1>
          <p className="text-xs text-muted-foreground mt-1">Select a route to start the refill manifest</p>
        </div>

        {/* Delivery Order Card */}
        <Card
          className="hover-elevate cursor-pointer transform hover:scale-[1.02] glass-card group border-2 border-primary/30"
          onClick={() => setLocation('/delivery-order')}
          data-testid="card-delivery-order"
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">New Delivery Order</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">
                  Create a new delivery order for customer
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Card
              key={route.id}
              className="hover-elevate cursor-pointer transform hover:scale-[1.02] glass-card group"
              onClick={() => setLocation(`/route/${route.id}`)}
              data-testid={`card-route-${route.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" />
                      <CardTitle className="text-base">{route.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{route.description}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs" data-testid={`badge-machines-${route.id}`}>
                        {route.machineCount} machines
                      </Badge>
                      <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 text-xs">
                        {route.needsRefill} need refill
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
