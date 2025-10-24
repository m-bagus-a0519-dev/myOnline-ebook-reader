import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2, AlertTriangle, ChevronLeft, ChevronRight, Square, ScrollText } from 'lucide-react';
import { Button } from '../components/ui/button';



// 1. Import react-pdf
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// 2. Tentukan URL API dan Konfigurasi PDF Worker
const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001';
//pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
//pdfjs.GlobalWorkerOptions.workerSrc = "//unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
const ReaderPage = () => {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isContinuous, setIsContinuous] = useState(false);

  // State untuk PDF
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const fetchBookData = async () => {
      if (!id) return; 

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/books/${id}`);
        if (response.data && response.data.success) {
          setBook(response.data.book);
          // Atur halaman saat ini dari data buku jika ada
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

  // --- Fungsi PDF ---
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function goToPrevPage() {
    setPageNumber(prevPage => Math.max(prevPage - 1, 1));
  }

  function goToNextPage() {
    setPageNumber(prevPage => Math.min(prevPage + 1, numPages));
  }

  // --- Tampilan Halaman ---

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-lg">Loading book...</p>
      </div>
    );
  }

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

  // --- Tampilan Render Buku ---
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

        {/* Kontrol Halaman & Mode */}
<div className="flex items-center space-x-2">

  {/* Hanya tampilkan navigasi jika TIDAK continuous */}
  {!isContinuous && (
    <>
      <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={pageNumber <= 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="w-20 text-center text-sm text-muted-foreground">
        Page {pageNumber} of {numPages || '--'}
      </span>
      <Button variant="outline" size="icon" onClick={goToNextPage} disabled={!numPages || pageNumber >= numPages}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  )}

  {/* Tombol Toggle Mode */}
  <Button
    variant="outline"
    size="icon"
    onClick={() => setIsContinuous(!isContinuous)}
    disabled={!numPages}
    title={isContinuous ? "Switch to single page view" : "Switch to continuous scroll view"}
    className="ml-2"
  >
    {isContinuous ? <Square className="h-4 w-4" /> : <ScrollText className="h-4 w-4" />}
  </Button>
</div>
      </header>

      {/* Konten Buku */}
      <main className="flex-1 overflow-auto dark:bg-gray-800">
        {/* Ubah div ini. Tambahkan 'dark:bg-gray-800' 
          untuk latar belakang halaman yang pas.
        */}
        <div className="flex justify-center p-4 dark:bg-gray-800">

          {/* INI SOLUSINYA: 
            Bungkus <Document> dengan div ini dan terapkan filter di sini.
          */}
          <div className="pdf-viewer-wrapper dark:filter dark:invert dark:hue-rotate-180">
            {book.file_type === 'pdf' ? (
              <Document
                file={`${API_URL.replace('/api', '')}${book.file_path}`}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<Loader2 className="h-8 w-8 animate-spin text-blue-500" />}
                error={<p>Failed to load PDF.</p>}
              >
                {/* ...logika <Page> Anda yang sudah bersih... */}
                {isContinuous ? (
                  Array.from(new Array(numPages), (el, index) => (
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