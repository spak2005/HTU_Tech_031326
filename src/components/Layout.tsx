import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Activity, Wrench, Rocket, Moon } from "lucide-react";
import { cn } from "../lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: "/track", label: "Track", icon: Activity },
    { path: "/improve", label: "Improve", icon: Wrench },
    { path: "/launch", label: "Launch", icon: Rocket },
  ];

  // Hide nav on login page
  if (location.pathname === "/login" || location.pathname === "/") {
    return <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/track" className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            Arcana
          </Link>
          
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-zinc-800 text-zinc-100" 
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-colors">
              <Moon className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium">
              U
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
}
