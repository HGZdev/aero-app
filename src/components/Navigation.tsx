import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Map, List, Home } from "lucide-react";

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/aero-app", label: "Dashboard", icon: Home },
    { path: "/aero-app/map", label: "Map", icon: Map },
    { path: "/aero-app/flights", label: "Flights", icon: List },
  ];

  return (
    <nav className="bg-aero-gray-darker/90 backdrop-blur-sm border-b border-aero-gray-dark sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/aero-app"
            className="flex items-center gap-2 text-white font-bold text-xl"
          >
            <BarChart3 className="h-6 w-6 text-aero-light" />
            Aero Dashboard
          </Link>

          <div className="flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? "bg-aero-blue text-white"
                    : "text-aero-gray-light hover:text-white hover:bg-aero-gray-darker"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
