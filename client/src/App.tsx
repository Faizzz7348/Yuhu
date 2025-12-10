import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MachineDetail from "@/pages/MachineDetail";
import RouteManifest from "@/pages/RouteManifest";
import DeliveryOrder from "@/pages/DeliveryOrder";
import ThemeToggle from "@/components/ThemeToggle";
import SettingsDialog from "@/components/SettingsDialog";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { DataProvider, useData } from "@/contexts/DataContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import MachineSelector from "@/components/MachineSelector";
import { Package2, Settings } from "lucide-react";
import { useParams } from "wouter";

function MachineDetailWrapper() {
  const { id } = useParams();
  return <MachineDetail />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/route/:id" component={RouteManifest} />
      <Route path="/delivery-order" component={DeliveryOrder} />
      <Route path="/refill-service/:id" component={MachineDetailWrapper} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { routes, machines, updateRoute, updateMachine } = useData();

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package2 className="w-5 h-5 text-primary transition-transform duration-200 hover:scale-110" />
            <span className="font-semibold text-sm hidden sm:inline">FM Vending</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              data-testid="button-settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <Router />

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        routes={routes}
        machines={machines}
        onUpdateRoute={updateRoute}
        onUpdateMachine={updateMachine}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <DataProvider>
            <AppContent />
            <PWAInstallPrompt />
            <Toaster />
          </DataProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
