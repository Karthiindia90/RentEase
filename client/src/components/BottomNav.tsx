import { Home, Users, CreditCard, BarChart3, MessageSquare } from "lucide-react";
import { Link, useLocation } from "wouter";

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  { path: "/", icon: Home, label: "Dashboard" },
  { path: "/tenants", icon: Users, label: "Tenants" },
  { path: "/plans", icon: CreditCard, label: "Plans" },
  { path: "/reports", icon: BarChart3, label: "Reports" },
  { path: "/messages", icon: MessageSquare, label: "Messages" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center flex-1 gap-1 hover-elevate active-elevate-2 rounded-md py-1"
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
