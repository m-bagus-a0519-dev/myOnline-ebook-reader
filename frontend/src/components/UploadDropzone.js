import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input'; // <-- 1. Import Input
import { Label } from './ui/label';   // <-- 2. Import Label
import { useBooks } from '../contexts/BookContext';
import { toast } from '../hooks/use-toast';
import axios from 'axios';

const API = process.env.REACT_APP_API_BASE_URL;

const UploadDropzone = ({ onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  // 3. Ubah dari array 'selectedFiles' menjadi 'selectedFile' (singular)
  const [selectedFile, setSelectedFile] = useState(null); 
  const [customTitle, setCustomTitle] = useState(''); // <-- 4. State untuk judul kustom
  const { addBook } = useBooks();
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Fungsi untuk memproses file
  const processFile = (file) => {
    if (!file) return;

    // Validasi tipe file
    const isValid = file.type === 'application/pdf' || file.name.endsWith('.epub');
    if (isValid) {
      setSelectedFile(file);
      // 5. Pre-fill input judul dengan nama file (tanpa ekstensi)
      setCustomTitle(file.name.replace(/\.[^/.]+$/, "")); 
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or EPUB file.",
        variant: "destructive"
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]); // Ambil file pertama saja
  };

  const handleFileSelect = (e) => {
    processFile(e.target.files[0]); // Ambil file pertama saja
  };

  const handleClear = () => {
    setSelectedFile(null);
    setCustomTitle('');
  };

  const handleUpload = async () => {
    if (!selectedFile || !customTitle) {
      toast({
        title: "Missing Information",
        description: "Please provide a file and a title.",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', customTitle); // <-- 6. Tambahkan judul kustom ke FormData

    try {
      await addBook(formData); // Fungsi addBook dari context sudah benar

      toast({
        title: "Success!",
        description: `"${customTitle}" has been uploaded.`
      });
      onClose(); // Menutup dialog setelah sukses

    } catch (error) {
      console.error("Gagal mengunggah file:", error);
      toast({
        title: "Upload failed",
        description: error.message || "An unknown error occurred.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' 
            : 'border-muted-foreground/25 hover:border-blue-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
        }`}
      >
        {/* Tampilan ini berubah setelah file dipilih */}
        {!selectedFile ? (
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full transition-colors ${
              isDragging ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-800'
            }`}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">
                {isDragging ? 'Drop file here' : 'Drag & drop your ebook'}
              </p>
              <p className="text-sm text-muted-foreground">Supports PDF and EPUB formats</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.epub"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button 
              type="button" 
              variant="outline" 
              className="mt-2"
              onClick={() => fileInputRef.current.click()}
            >
              Browse File
            </Button>
          </div>
        ) : (
          // Tampilan setelah file dipilih
          <div className="flex flex-col items-center text-left space-y-4">
            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border w-full">
              <FileText className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">{selectedFile.name}</span>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 ml-auto" onClick={handleClear}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 7. Tampilkan Input Judul HANYA jika file sudah ada */}
      {selectedFile && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Book Title</Label>
            <Input
              id="title"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Enter book title"
            />
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button onClick={handleUpload} className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Upload Book
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDropzone;