import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Plane } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <Plane className="h-24 w-24 mx-auto mb-4 text-aero-light" />
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-aero-gray-light mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-aero-blue text-white rounded-lg hover:bg-aero-dark transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-aero-gray-dark text-white rounded-lg hover:bg-aero-gray-dark transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
