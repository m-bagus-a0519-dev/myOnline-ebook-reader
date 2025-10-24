import React, { useState , useRef} from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from './ui/button';
import { useBooks } from '../contexts/BookContext';
import { toast } from '../hooks/use-toast';
import axios from 'axios';


const API = process.env.REACT_APP_API_BASE_URL;
const UploadDropzone = ({ onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { addBook } = useBooks();
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || file.name.endsWith('.epub')
    );
    setSelectedFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

// --- DENGAN INI ---
const handleUpload = async () => {
  const formData = new FormData();
  selectedFiles.forEach(file => {
    formData.append('file', file);
  });

  try {
    // 1. Panggil fungsi 'addBook' dari context. 
    //    Fungsi ini sudah menangani axios.post DAN fetchBooks().
    await addBook(formData);

    // 2. Beri notifikasi sukses dan tutup dialog
    toast({
      title: "Success!",
      description: `${selectedFiles.length} book(s) uploaded.`
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
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full transition-colors ${
            isDragging 
              ? 'bg-blue-100 dark:bg-blue-900/30' 
              : 'bg-slate-100 dark:bg-slate-800'
          }`}>
            <Upload className={`w-8 h-8 ${
              isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
            }`} />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground mb-1">
              {isDragging ? 'Drop files here' : 'Drag & drop your ebooks'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports PDF and EPUB formats
            </p>
          </div>
         
     <input
       ref={fileInputRef} // <-- 1. Tambahkan ref di sini
       type="file"
       multiple
       accept=".pdf,.epub"
       onChange={handleFileSelect}
       className="hidden"
     />
     <Button 
       type="button" 
       variant="outline" 
       className="mt-2"
       onClick={() => fileInputRef.current.click()} // <-- 2. Tambahkan onClick
     >
       Browse Files
     </Button>

        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Selected files:</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-muted"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-foreground">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex space-x-2 pt-2">
            <Button onClick={handleUpload} className="flex-1">
              Upload {selectedFiles.length} file(s)
            </Button>
            <Button variant="outline" onClick={() => setSelectedFiles([])}>
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDropzone;
