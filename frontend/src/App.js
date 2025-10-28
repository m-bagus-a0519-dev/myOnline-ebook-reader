// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';

// 1. Impor SEMUA provider
import { ThemeProvider } from './contexts/ThemeContext'; // <-- PASTIKAN NAMA FILE INI BENAR
import { AuthProvider } from './contexts/AuthContext';
import { BookProvider } from './contexts/BookContext';

// 2. Impor Halaman & Rute
import LibraryPage from './pages/LibraryPage';
import ReaderPage from './pages/ReaderPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    // 3. ThemeProvider HARUS ada di paling luar
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BookProvider>
          <BrowserRouter>
            <Routes>
              {/* Rute Publik */}
              <Route path="/login" element={<LoginPage />} />

              {/* Rute yang Dilindungi */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<LibraryPage />} />
                <Route path="/reader/:id" element={<ReaderPage />} />
              </Route>
              
            </Routes>
          </BrowserRouter>
          <Toaster />
        </BookProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;