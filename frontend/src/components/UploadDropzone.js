import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from './ui/button';
import { useBooks } from '../contexts/BookContext';
import { toast } from './ui/use-toast';

const UploadDropzone = ({ onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { addBook } = useBooks();

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

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const book = {
          title: file.name,
          type: file.type === 'application/pdf' ? 'pdf' : 'epub',
          cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
          category: 'menu_book',
          totalPages: 100,
          fileUrl: e.target.result
        };
        addBook(book);
      };
      reader.readAsDataURL(file);
    });

    toast({
      title: "Books uploaded!",
      description: `Successfully added ${selectedFiles.length} book(s) to your library.`,
    });

    setSelectedFiles([]);
    onClose();
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
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept=".pdf,.epub"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button type="button" variant="outline" className="mt-2">
              Browse Files
            </Button>
          </label>
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
