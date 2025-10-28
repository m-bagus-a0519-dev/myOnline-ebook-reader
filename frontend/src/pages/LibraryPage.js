import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library, Upload, Sun, Moon, Search, Grid3x3, List, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import BookCard from '../components/BookCard';
import UploadDropzone from '../components/UploadDropzone';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BookContext';
import { Toaster } from '../components/ui/toaster';
import { useAuth } from '../contexts/AuthContext';



import { LogOut } from 'lucide-react';

// --- BENAR ---
const LibraryPage = () => {
  const { logout } = useAuth(); // <-- TAMBAHKAN INI
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  // 1. Ambil 'books' (daftar utuh), bukan 'filteredBooks'
  const { books, searchQuery, setSearchQuery } = useBooks(); 
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');

  // 2. Buat 'filteredBooks' secara manual berdasarkan pencarian
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. Logika Anda selanjutnya untuk filter status sekarang sudah benar
  const statusFilteredBooks = filteredBooks.filter(book => {
    if (filterStatus === 'all') return true;
    return book.status === filterStatus;
  });
// --- BENAR ---

  const stats = {
    total: filteredBooks.length,
    reading: filteredBooks.filter(b => b.status === 'reading').length,
    completed: filteredBooks.filter(b => b.status === 'completed').length,
    notStarted: filteredBooks.filter(b => b.status === 'not-started').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/10 dark:to-slate-950 transition-colors duration-300">
      <Toaster />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                <Library className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  My Library
                </h1>
                <p className="text-sm text-muted-foreground">{stats.total} books in total</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Book
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Upload New Book</DialogTitle>
                  </DialogHeader>
                  <UploadDropzone onClose={() => setUploadOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px] rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Books</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="icon" onClick={logout} title="Logout">
      <LogOut className="h-4 w-4" />
    </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-muted-foreground mb-1">Reading</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.reading}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-muted-foreground mb-1">Not Started</p>
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.notStarted}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm text-muted-foreground mb-1">Total</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
        </div>

        {/* Books Grid */}
        {statusFilteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-100 dark:bg-slate-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Library className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No books found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try a different search term' : 'Upload your first book to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setUploadOpen(true)} className="rounded-xl">
                <Upload className="w-4 h-4 mr-2" />
                Upload Book
              </Button>
            )}
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6' 
              : 'space-y-4'
          }`}>
            {statusFilteredBooks.map(book => (
  <BookCard key={book._id} book={book} />
))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
