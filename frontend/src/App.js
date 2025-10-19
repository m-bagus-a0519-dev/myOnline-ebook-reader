import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BookProvider } from "./contexts/BookContext";
import LibraryPage from "./pages/LibraryPage";
import ReaderPage from "./pages/ReaderPage";

function App() {
  return (
    <ThemeProvider>
      <BookProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/reader/:id" element={<ReaderPage />} />
          </Routes>
        </BrowserRouter>
      </BookProvider>
    </ThemeProvider>
  );
}

export default App;
