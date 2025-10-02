import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import TenantList from "@/pages/TenantList";
import TenantForm from "@/pages/TenantForm";
import TenantDetail from "@/pages/TenantDetail";
import Plans from "@/pages/Plans";
import Reports from "@/pages/Reports";
import Messages from "@/pages/Messages";
import BottomNav from "@/components/BottomNav";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tenants" component={TenantList} />
      <Route path="/tenants/new" component={TenantForm} />
      <Route path="/tenants/:id/edit" component={TenantForm} />
      <Route path="/tenants/:id" component={TenantDetail} />
      <Route path="/plans" component={Plans} />
      <Route path="/reports" component={Reports} />
      <Route path="/messages" component={Messages} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="h-screen overflow-hidden bg-background">
          <Router />
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
