import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ArrowLeft, Loader2, AlertTriangle, ChevronLeft, ChevronRight, Square, ScrollText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useBooks } from '../contexts/BookContext';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';
const BASE_URL = API_URL.replace('/api', '');
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const ReaderPage = () => {
  const { id } = useParams(); 
  const { updateProgress } = useBooks();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isContinuous, setIsContinuous] = useState(false);
  
  // ✅ PERBAIKAN: Hapus numPages, hanya pakai totalPages
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  // Fetch book data
  useEffect(() => {
    const fetchBookData = async () => {
      if (!id) return; 

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/books/${id}`);
        
        if (response.data && response.data.success) {
          setBook(response.data.book);
          if (response.data.book.current_page) {
            setPageNumber(response.data.book.current_page);
          }
        } else {
          setError("Gagal mengambil data buku.");
        }
      } catch (err) {
        console.error("Error fetching book:", err);
        setError(err.response?.data?.error || "Book not found");
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  // ✅ PERBAIKAN: Update progress dengan debounce
  useEffect(() => {
    // Jangan update jika belum ada total pages atau masih di halaman 1
    if (totalPages === 0 || pageNumber <= 1) return;
  
    const handler = setTimeout(() => {
      console.log(`[Progress Update] Page ${pageNumber} of ${totalPages}`);
      updateProgress(id, pageNumber, totalPages);
    }, 2000);
  
    return () => clearTimeout(handler);
  }, [pageNumber, totalPages, id, updateProgress]);

  // ✅ PERBAIKAN: Hanya satu fungsi onDocumentLoadSuccess
  function onDocumentLoadSuccess({ numPages }) {
    console.log(`[PDF Loaded] Total pages: ${numPages}`);
    setTotalPages(numPages);
  }

  function goToPrevPage() {
    setPageNumber(prevPage => Math.max(prevPage - 1, 1));
  }

  function goToNextPage() {
    setPageNumber(prevPage => Math.min(prevPage + 1, totalPages));
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-lg">Loading book...</p>
      </div>
    );
  }

  // Error state
  if (error || !book) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-red-500">
        <AlertTriangle className="h-12 w-12" />
        <h2 className="mt-4 text-2xl font-bold">Error: Book Not Found</h2>
        <p className="mt-2">{error}</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/">← Back to Library</Link>
        </Button>
      </div>
    );
  }

  // Main render
  return (
    <div className="flex h-screen flex-col bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-2 px-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center">
          <Button asChild variant="outline" size="icon">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="ml-4 truncate text-lg font-semibold">
            {book.title}
          </h1>
        </div>

        {/* Page Controls */}
        <div className="flex items-center space-x-2">
          {!isContinuous && (
            <>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToPrevPage} 
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="w-20 text-center text-sm text-muted-foreground">
                Page {pageNumber} of {totalPages || '--'}
              </span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={goToNextPage} 
                disabled={!totalPages || pageNumber >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Toggle View Mode */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsContinuous(!isContinuous)}
            disabled={!totalPages}
            title={isContinuous ? "Switch to single page view" : "Switch to continuous scroll view"}
            className="ml-2"
          >
            {isContinuous ? <Square className="h-4 w-4" /> : <ScrollText className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* PDF Content */}
      <main className="flex-1 overflow-auto dark:bg-gray-800">
        <div className="flex justify-center p-4 dark:bg-gray-800">
          <div className="pdf-viewer-wrapper dark:filter dark:invert dark:hue-rotate-180">
            {book.file_type === 'pdf' ? (
              <Document
                file={`${BASE_URL}${book.file_path}`}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<Loader2 className="h-8 w-8 animate-spin text-blue-500" />}
                error={<p>Failed to load PDF.</p>}
              >
                {isContinuous ? (
                  Array.from(new Array(totalPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={Math.min(window.innerWidth * 0.9, 800)}
                      className="mb-4"
                    />
                  ))
                ) : (
                  <Page 
                    pageNumber={pageNumber}
                    width={Math.min(window.innerWidth * 0.9, 800)}
                  />
                )}
              </Document>
            ) : (
              <p>EPUB rendering belum diimplementasikan.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReaderPage;