import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  Bookmark, 
  BookmarkCheck,
  ChevronLeft, 
  ChevronRight,
  Menu,
  Search,
  Type,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import { ScrollArea } from '../components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BookContext';
import { toast } from '../components/ui/use-toast';
import { Toaster } from '../components/ui/toaster';

const ReaderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { books, updateProgress, addBookmark, removeBookmark } = useBooks();
  
  const book = books.find(b => b.id === id);
  
  const [currentPage, setCurrentPage] = useState(book?.currentPage || 1);
  const [fontSize, setFontSize] = useState(16);
  const [searchText, setSearchText] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (book) {
      updateProgress(book.id, currentPage, book.totalPages);
    }
  }, [currentPage]);

  useEffect(() => {
    let timeout;
    if (isFullscreen) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isFullscreen, showControls]);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Book not found</h2>
          <Button onClick={() => navigate('/')}>Back to Library</Button>
        </div>
      </div>
    );
  }

  const isBookmarked = book.bookmarks.includes(currentPage);
  const progress = Math.round((currentPage / book.totalPages) * 100);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < book.totalPages) setCurrentPage(currentPage + 1);
  };

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      removeBookmark(book.id, currentPage);
      toast({ title: "Bookmark removed" });
    } else {
      addBookmark(book.id, currentPage);
      toast({ title: "Bookmark added" });
    }
  };

  const handlePageJump = (page) => {
    if (page >= 1 && page <= book.totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      className={`min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
      onMouseMove={() => isFullscreen && setShowControls(true)}
    >
      <Toaster />
      
      {/* Header */}
      <header 
        className={`bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ${
          isFullscreen && !showControls ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold truncate text-foreground">{book.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {book.totalPages} • {progress}%
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Font Size Control */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl hidden sm:flex">
                    <Type className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Reading Settings</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Font Size: {fontSize}px</label>
                      <Slider
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        min={12}
                        max={24}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preview</label>
                      <p style={{ fontSize: `${fontSize}px` }} className="text-foreground leading-relaxed">
                        The quick brown fox jumps over the lazy dog. This is how your text will appear.
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Search */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl hidden sm:flex">
                    <Search className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Search in Book</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <Input
                      placeholder="Search text..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="mb-4"
                    />
                    <p className="text-sm text-muted-foreground">
                      {searchText ? `Searching for "${searchText}"...` : 'Enter text to search'}
                    </p>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Bookmarks */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl relative">
                    <Bookmark className="w-5 h-5" />
                    {book.bookmarks.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {book.bookmarks.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Bookmarks</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                    {book.bookmarks.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No bookmarks yet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {book.bookmarks.map(page => (
                          <button
                            key={page}
                            onClick={() => handlePageJump(page)}
                            className="w-full p-3 text-left rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                          >
                            <p className="font-medium text-foreground">Page {page}</p>
                            <p className="text-sm text-muted-foreground">Click to jump</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                size="icon"
                onClick={handleBookmarkToggle}
                className={`rounded-xl ${
                  isBookmarked ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-xl"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="rounded-xl hidden md:flex"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <Progress value={progress} className="h-1" />
          </div>
        </div>
      </header>

      {/* Reader Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Book Cover for Demo */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 mb-6 shadow-lg">
            <div className="aspect-[8.5/11] bg-white dark:bg-slate-950 rounded-xl shadow-2xl flex items-center justify-center overflow-hidden">
              <img 
                src={book.cover} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Demo Text Content */}
          <div 
            className="prose prose-slate dark:prose-invert max-w-none bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-800"
            style={{ fontSize: `${fontSize}px` }}
          >
            <h2 className="text-2xl font-bold mb-4">Chapter {currentPage}</h2>
            <p className="leading-relaxed mb-4">
              This is a demo ebook reader. In the actual implementation, this area would display the actual content from your PDF or EPUB file. The reader supports various features including:
            </p>
            <ul className="space-y-2 mb-4">
              <li>Page navigation with previous/next buttons</li>
              <li>Bookmarking pages for quick access</li>
              <li>Adjustable font size for comfortable reading</li>
              <li>Search functionality within the book</li>
              <li>Night mode for reading in low light</li>
              <li>Progress tracking and statistics</li>
              <li>Fullscreen mode for immersive reading</li>
              <li>Responsive design for mobile and desktop</li>
            </ul>
            <p className="leading-relaxed mb-4">
              Your reading position is automatically saved, so you can always pick up where you left off. The progress bar at the top shows your current position in the book.
            </p>
            <p className="leading-relaxed">
              Once connected to the backend, this reader will load actual PDF and EPUB files, render them properly, and sync your reading progress across devices.
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer 
        className={`fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 transition-all duration-300 ${
          isFullscreen && !showControls ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="rounded-xl"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-3">
              <Input
                type="number"
                min={1}
                max={book.totalPages}
                value={currentPage}
                onChange={(e) => handlePageJump(parseInt(e.target.value) || 1)}
                className="w-20 text-center rounded-xl"
              />
              <span className="text-sm text-muted-foreground">/ {book.totalPages}</span>
            </div>

            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === book.totalPages}
              className="rounded-xl"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReaderPage;
