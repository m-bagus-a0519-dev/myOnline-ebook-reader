import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // <-- 1. GANTI axios DENGAN INI
// src/contexts/BookContext.js
import { useToast } from '../hooks/use-toast'; // <-- TAMBAHKAN IMPOR INI
// import { mockBooks, mockCollections } from '../data/mockData'; // <-- Kita tidak perlu ini lagi

// 1. Tentukan URL API dari .env
//const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  // 2. Inisialisasi state sebagai array kosong
  const [books, setBooks] = useState([]);
  const [collections, setCollections] = useState([]); // Anda bisa biarkan ini jika masih mock
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // 3. Buat fungsi untuk mengambil data dari backend
  const fetchBooks = async (params = {}) => {
    try {
      // Panggil backend: GET http://localhost:8001/api/books
      const response = await api.get('/books', { params });
      setBooks(response.data.books); // Simpan data dari server ke state
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);
    }
  };

  // 4. Panggil fetchBooks() saat komponen pertama kali dimuat
  useEffect(() => {
    fetchBooks();
  }, []); // [] berarti "hanya jalankan satu kali saat mount"

  // 5. Modifikasi addBook untuk mengirim FormData ke backend
  const addBook = async (formData) => {
    // formData akan berisi file yang di-upload
    try {
      // Panggil backend: POST http://localhost:8001/api/books/upload
      await api.post('/books/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Setelah berhasil upload, panggil fetchBooks() lagi
      // untuk me-refresh daftar buku dengan data terbaru dari server
      await fetchBooks();
    } catch (error) {
      console.error("Gagal menambah buku:", error);
      // Anda bisa menambahkan notifikasi error untuk user di sini
      throw error;
    }
  };




  // 6. Contoh fungsi untuk update progress (sesuai contracts.md)
  const updateProgress = async (bookId, currentPage, totalPages) => {
    try {
      // Panggil backend: PUT http://localhost:8001/api/books/:id/progress
      await axios.put(`${API_URL}/books/${bookId}/progress`, {
        current_page: currentPage,
        total_pages: totalPages,
      });
      // Opsional: update state lokal untuk UI yang lebih responsif
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId // Pastikan menggunakan _id dari MongoDB
            ? { ...book, current_page: currentPage, progress: (currentPage / totalPages) * 100 }
            : book
        )
      );
    } catch (error) {
      console.error("Gagal update progress:", error);
    }
  };

  //Delete book

const deleteBook = async (id) => {
  try {
    // 1. Panggil API backend
    const response = await await api.delete(`/books/${id}`);

    if (response.data.success) {
      // 2. Perbarui state lokal (hapus buku dari array)
      setBooks(prevBooks => 
        prevBooks.filter(book => book._id !== response.data.deletedBookId)
      );

      toast({
        title: "Book Deleted",
        description: "The book has been removed from your library.",
      });
    }
  } catch (err) {
    console.error("Failed to delete book:", err);
    toast({
      title: "Error Deleting Book",
      description: err.response?.data?.error || "Could not delete book.",
      variant: "destructive",
    });
  }
};

  return (
    // 7. Sediakan fungsi baru ke komponen lain
    <BookContext.Provider
      value={{
        books,
        collections,
        searchQuery,
        setSearchQuery,
        addBook, // Fungsi addBook yang sudah dimodifikasi
        fetchBooks,
        updateProgress, // Fungsi baru untuk update progress
        deleteBook
        // Anda bisa tambahkan deleteBook, dll. di sini
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

// Hook kustom untuk memudahkan penggunaan context
export const useBooks = () => useContext(BookContext);