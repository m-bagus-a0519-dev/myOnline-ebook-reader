import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useToast } from '../hooks/use-toast';

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const fetchBooks = async (params = {}) => {
    try {
      const response = await api.get('/books', { params });
      setBooks(response.data.books);
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ✅ PERBAIKAN: Hapus header Content-Type
  const addBook = async (formData) => {
    try {
      await api.post('/books/upload', formData);
      // ✅ PERBAIKAN: Beri feedback sukses
      toast({
        title: "Upload Successful",
        description: "Your book has been added to the library.",
      });
      await fetchBooks();
    } catch (error) {
      console.error("Gagal menambah buku:", error);
      // ✅ PERBAIKAN: Tampilkan error ke user
      toast({
        title: "Upload Failed",
        description: error.response?.data?.error || "Could not upload book.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProgress = async (bookId, currentPage, totalPages) => {
    try {
      await api.put(`/books/${bookId}/progress`, {
        current_page: currentPage,
        total_pages: totalPages,
      });
      
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId
            ? { 
                ...book, 
                current_page: currentPage, 
                progress: (currentPage / totalPages) * 100 
              }
            : book
        )
      );
    } catch (error) {
      console.error("Gagal update progress:", error);
    }
  };

  const deleteBook = async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);

      if (response.data.success) {
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
    <BookContext.Provider
      value={{
        books,
        collections,
        searchQuery,
        setSearchQuery,
        addBook,
        fetchBooks,
        updateProgress,
        deleteBook
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => useContext(BookContext);