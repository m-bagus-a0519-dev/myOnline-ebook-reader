// Mock data for ebook reader

export const mockBooks = [
  {
    id: '1',
    title: 'PERBUP Kab. Tahun 2022.pdf',
    type: 'pdf',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    status: 'reading',
    progress: 15,
    lastRead: '2 days ago',
    category: 'menu_book',
    totalPages: 8,
    currentPage: 5,
    fileUrl: null,
    content: 'Sample PDF content would be loaded here',
    bookmarks: []
  },
  {
    id: '2',
    title: 'Advanced Web Design',
    type: 'epub',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    status: 'not-started',
    progress: 0,
    lastRead: null,
    category: 'science',
    totalPages: 120,
    currentPage: 1,
    fileUrl: null,
    content: 'Sample EPUB content',
    bookmarks: []
  },
  {
    id: '3',
    title: 'The Science of Everything',
    type: 'pdf',
    cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=600&fit=crop',
    status: 'reading',
    progress: 50,
    lastRead: '5 hours ago',
    category: 'science',
    totalPages: 200,
    currentPage: 100,
    fileUrl: null,
    content: 'Science book content',
    bookmarks: [25, 67, 89]
  },
  {
    id: '4',
    title: 'A Brief History of Code',
    type: 'epub',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
    status: 'completed',
    progress: 100,
    lastRead: '1 week ago',
    category: 'history_edu',
    totalPages: 350,
    currentPage: 350,
    fileUrl: null,
    content: 'History of programming',
    bookmarks: [45, 120, 234]
  }
];

export const mockCollections = [
  { id: '1', name: 'Currently Reading', bookIds: ['1', '3'] },
  { id: '2', name: 'Programming', bookIds: ['2', '4'] },
  { id: '3', name: 'Favorites', bookIds: ['4'] }
];
