import React, { createContext, useContext, useState } from 'react';
import { mockBooks, mockCollections } from '../data/mockData';

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState(mockBooks);
  const [collections, setCollections] = useState(mockCollections);
  const [searchQuery, setSearchQuery] = useState('');

  const addBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now().toString(),
      status: 'not-started',
      progress: 0,
      lastRead: null,
      currentPage: 1,
      bookmarks: []
    };
    setBooks([...books, newBook]);
  };

  const updateBook = (id, updates) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, ...updates } : book
    ));
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const updateProgress = (id, currentPage, totalPages) => {
    const progress = Math.round((currentPage / totalPages) * 100);
    const status = progress === 100 ? 'completed' : progress > 0 ? 'reading' : 'not-started';
    updateBook(id, { 
      currentPage, 
      progress, 
      status,
      lastRead: 'Just now'
    });
  };

  const addBookmark = (bookId, page) => {
    const book = books.find(b => b.id === bookId);
    if (book && !book.bookmarks.includes(page)) {
      updateBook(bookId, {
        bookmarks: [...book.bookmarks, page].sort((a, b) => a - b)
      });
    }
  };

  const removeBookmark = (bookId, page) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      updateBook(bookId, {
        bookmarks: book.bookmarks.filter(p => p !== page)
      });
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BookContext.Provider value={{
      books,
      collections,
      searchQuery,
      setSearchQuery,
      addBook,
      updateBook,
      deleteBook,
      updateProgress,
      addBookmark,
      removeBookmark,
      filteredBooks
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within BookProvider');
  }
  return context;
};
