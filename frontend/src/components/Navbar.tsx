import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-5 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        <Link to="/dashboard" className="text-xl font-bold text-blue-600 no-underline">
          Dashboard Analytics
        </Link>
        
        <div className="flex items-center gap-5">
          <Link to="/dashboard" className="text-gray-700 no-underline text-base hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/account" className="text-gray-700 no-underline text-base hover:text-blue-600 transition-colors">
            Mon Compte
          </Link>
          {user && (
            <span className="text-sm text-gray-600">
              {user.name}
            </span>
          )}
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-600 text-white border-none rounded-md cursor-pointer text-sm hover:bg-red-700 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
