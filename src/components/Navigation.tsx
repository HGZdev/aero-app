import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Map, List, Home } from "lucide-react";

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/map", label: "Map", icon: Map },
    { path: "/flights", label: "Flights", icon: List },
  ];

  return (
    <nav className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-bold text-xl"
          >
            <BarChart3
              className="h-6 w-6"
              style={{ color: "var(--color-aero-light)" }}
            />
            Aero Dashboard
          </Link>

          <div className="flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
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
