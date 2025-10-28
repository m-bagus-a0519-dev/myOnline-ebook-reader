// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Impor instance axios kita
import { useToast } from '../hooks/use-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // Untuk cek login awal
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      // Jika ada token, coba verifikasi (kita bisa tambahkan endpoint /me nanti)
      // Untuk saat ini, kita anggap token valid jika ada
      // Di aplikasi nyata, kita akan panggil GET /api/auth/me
      setLoading(false); 
      // Kita bisa decode token untuk dapatkan data user jika perlu
      // const decoded = jwt_decode(token); 
      // setUser(decoded);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        // setUser( ... kita bisa decode token di sini ...);
        toast({ title: "Login Successful" });
        return true;
      }
    } catch (err) {
      toast({
        title: "Login Failed",
        description: err.response?.data?.error || "Invalid credentials",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);