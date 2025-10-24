import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FlaskConical, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useBooks } from '../contexts/BookContext'; // (Sesuaikan path jika perlu)
import { MoreVertical, Trash2 } from 'lucide-react';
import { Button } from './ui/button'; // Pastikan Button diimpor
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001';

const categoryIcons = {
  menu_book: BookOpen,
  science: FlaskConical,
  history_edu: GraduationCap
};

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const { deleteBook } = useBooks();
  const CategoryIcon = categoryIcons[book.category] || BookOpen;

  const getStatusBadge = () => {
    switch (book.status) {
      case 'completed':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'reading':
        return (
          <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20">
            <Clock className="w-3 h-3 mr-1" />
            {book.lastRead}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Not started
          </Badge>
        );
    }
  };
  const handleDelete = (e) => {
    // Hentikan card utama agar tidak ter-klik (yang akan pindah halaman)
    e.stopPropagation(); 

    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      deleteBook(book._id);
    }
  };

  return (
    <Card 
  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-muted/40 overflow-hidden"
  onClick={() => navigate(`/reader/${book._id}`)}
>
      <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <img 
          src={`${API_URL.replace('/api', '')}${book.cover_image}`} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Kode baru dengan Dropdown Menu */}
<div className="absolute top-3 right-3 flex flex-col items-end gap-2">
  {/* Ikon Kategori yang sudah ada */}
  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
    <CategoryIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
  </div>

  {/* Tombol Hapus (Dropdown) BARU */}
  <DropdownMenu>
    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-slate-800">
        <MoreVertical className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
      <DropdownMenuItem
        className="flex items-center text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 dark:focus:text-red-400"
        onClick={handleDelete}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        <span>Delete Book</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {book.title}
        </h3>
        
        <div className="flex items-center justify-between">
          {getStatusBadge()}
        </div>

        {book.progress > 0 && book.progress < 100 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium">{book.progress}%</span>
            </div>
            <Progress value={book.progress} className="h-1.5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookCard;
