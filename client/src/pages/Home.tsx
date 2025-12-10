import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, ChevronRight, Package, Loader2 } from "lucide-react";
import { useData } from "@/contexts/DataContext";

export default function Home() {
  const [, setLocation] = useLocation();
  const { routes } = useData();
  const [navigating, setNavigating] = useState(false);

  const handleNavigation = (path: string) => {
    setNavigating(true);
    setTimeout(() => {
      setLocation(path);
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {navigating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
      
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-xl font-bold tracking-tight" data-testid="text-page-title">Delivery Routes</h1>
          <p className="text-xs text-muted-foreground mt-1">Select a route to start the refill manifest</p>
        </div>

        {/* Delivery Order Card */}
        <Card
          className="hover-elevate cursor-pointer transform hover:scale-[1.02] glass-card group border-2 border-primary/30 transition-all duration-300 animate-in slide-in-from-bottom-4 delay-100"
          onClick={() => handleNavigation('/delivery-order')}
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
          {routes.map((route, index) => (
            <Card
              key={route.id}
              className="hover-elevate cursor-pointer transform hover:scale-[1.02] glass-card group transition-all duration-300 animate-in slide-in-from-bottom-4"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
              onClick={() => handleNavigation(`/route/${route.id}`)}
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
