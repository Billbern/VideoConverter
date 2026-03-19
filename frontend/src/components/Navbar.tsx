// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <div className="logo">
        <div className="logo-icon">☀️</div>
        Fluxr
      </div>
      <div className="nav-links">
        <Link to="/">Formats</Link>
        <Link to="/api">API</Link>
        <Link to="/pricing">Pricing</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button className="btn-primary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary">
              ✨ Try Pro free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;