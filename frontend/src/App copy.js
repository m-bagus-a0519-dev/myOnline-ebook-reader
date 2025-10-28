// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { BookProvider } from './contexts/BookContext';

import LibraryPage from './pages/LibraryPage';
import ReaderPage from './pages/ReaderPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthProvider> {/* 1. AuthProvider membungkus semuanya */}
      <BookProvider> {/* 2. BookProvider di dalamnya */}
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