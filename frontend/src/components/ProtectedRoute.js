// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    // Tampilkan loading spinner saat cek token awal
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  // Jika tidak loading, cek token
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;