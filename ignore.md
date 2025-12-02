# 🚀 Complete Next.js + Tailwind CSS CRUD Guide with TypeScript

## 📚 **Part 1: Foundation & Setup**

### **1.1 Next.js Overview**
Next.js is a React framework that enables:
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- File-based routing
- Built-in TypeScript support

### **1.2 Tailwind CSS Overview**
A utility-first CSS framework for rapid UI development:
- Utility classes instead of custom CSS
- Responsive design
- Component-friendly

### **1.3 Installation**

```bash
# Create Next.js app with TypeScript and Tailwind
npx create-next-app@latest book-crud-app --typescript --tailwind --app
cd book-crud-app
npm install

# Install additional dependencies
npm install class-variance-authority clsx tailwind-merge
```

### **1.4 Project Structure**
```
book-crud-app/
├── app/
│   ├── api/
│   │   └── books/
│   │       ├── route.ts          # API endpoints
│   │       └── [id]/route.ts     # Dynamic API routes
│   ├── books/
│   │   ├── page.tsx             # Books listing
│   │   ├── [id]/page.tsx        # Single book view
│   │   └── [id]/edit/page.tsx   # Edit book page
│   ├── add-book/
│   │   └── page.tsx             # Add new book
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── BookCard.tsx
│   ├── BookForm.tsx
│   └── BookList.tsx
├── lib/
│   ├── types.ts
│   └── utils.ts
└── package.json
```

## 📘 **Part 2: TypeScript Fundamentals**

### **2.1 Basic Types**
```typescript
// lib/types.ts

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  genre: string;
  rating: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}

export type BookFormData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
export type PartialBook = Partial<Book>;

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
```

### **2.2 TypeScript with Arrays**
```typescript
// Array operations with types
const books: Book[] = [];

// Type-safe operations
const addBook = (book: Book): Book[] => [...books, book];
const filterByGenre = (genre: string): Book[] => 
  books.filter(book => book.genre === genre);
const findBook = (id: string): Book | undefined =>
  books.find(book => book.id === id);
```

## 🔄 **Part 3: Next.js Concepts**

### **3.1 File-based Routing**
```typescript
// app/page.tsx -> /
// app/books/page.tsx -> /books
// app/books/[id]/page.tsx -> /books/123
// app/books/[id]/edit/page.tsx -> /books/123/edit
```

### **3.2 Dynamic Routing**
```typescript
// app/books/[id]/page.tsx
interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  // Fetch book with id
}
```

### **3.3 Server Components vs Client Components**
```typescript
// Server Component (default)
export default function BooksPage() {
  // Can use async/await, fetch data directly
  return <div>Server Component</div>;
}

// Client Component
'use client';
import { useEffect, useState } from 'react';

export default function ClientComponent() {
  const [state, setState] = useState('');
  useEffect(() => { /* side effects */ }, []);
  
  return <div>Client Component</div>;
}
```

### **3.4 Data Fetching Patterns**
```typescript
// Server Component fetching
async function getBooks() {
  // Direct database access or API call
  return books;
}

// Client-side fetching
async function fetchBooks() {
  const res = await fetch('/api/books');
  return res.json();
}
```

## 🛠️ **Part 4: Building the CRUD Application**

### **4.1 Setting up Data Layer**
```typescript
// lib/books-data.ts (In-memory storage)
'use server';

import { Book } from './types';
import { v4 as uuidv4 } from 'uuid';

// In-memory array (for development)
let books: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic novel of the Jazz Age',
    publishedYear: 1925,
    genre: 'Classic',
    rating: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more sample books
];

// Server actions for CRUD operations
export async function getBooks(): Promise<Book[]> {
  return books;
}

export async function getBook(id: string): Promise<Book | undefined> {
  return books.find(book => book.id === id);
}

export async function addBook(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
  const newBook: Book = {
    ...bookData,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  books.push(newBook);
  return newBook;
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<Book | undefined> {
  const index = books.findIndex(book => book.id === id);
  if (index === -1) return undefined;
  
  books[index] = {
    ...books[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  return books[index];
}

export async function deleteBook(id: string): Promise<boolean> {
  const initialLength = books.length;
  books = books.filter(book => book.id !== id);
  return books.length < initialLength;
}
```

### **4.2 Creating API Routes**
```typescript
// app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBooks, addBook } from '@/lib/books-data';

export async function GET() {
  try {
    const books = await getBooks();
    return NextResponse.json({ success: true, data: books });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newBook = await addBook(body);
    return NextResponse.json(
      { success: true, data: newBook, message: 'Book added successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add book' },
      { status: 400 }
    );
  }
}
```

```typescript
// app/api/books/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBook, updateBook, deleteBook } from '@/lib/books-data';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const book = await getBook(id);
    
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: book });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedBook = await updateBook(id, body);
    
    if (!updatedBook) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedBook,
      message: 'Book updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update book' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await deleteBook(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}
```

### **4.3 UI Components with Tailwind CSS**

```tsx
// components/BookCard.tsx
import { Book } from '@/lib/types';
import Link from 'next/link';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {book.title}
            </h3>
            <p className="text-gray-600 mb-1">by {book.author}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {book.genre}
              </span>
              <span className="text-gray-500 text-sm">
                {book.publishedYear}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-yellow-400 flex">
              {'★'.repeat(Math.floor(book.rating))}
              {'☆'.repeat(5 - Math.floor(book.rating))}
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-2">
          {book.description}
        </p>
        
        <div className="flex gap-2">
          <Link
            href={`/books/${book.id}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          <Link
            href={`/books/${book.id}/edit`}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
```

```tsx
// components/BookList.tsx
'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/lib/types';
import BookCard from './BookCard';

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/books');
      const data = await response.json();
      if (data.success) {
        setBooks(data.data);
      }
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setBooks(books.filter(book => book.id !== id));
      }
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  // Array operations in action
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
                         book.author.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter === 'all' || book.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'year') return b.publishedYear - a.publishedYear;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Using reduce to get statistics
  const stats = books.reduce((acc, book) => {
    acc.totalBooks++;
    acc.genreCount[book.genre] = (acc.genreCount[book.genre] || 0) + 1;
    acc.totalRating += book.rating;
    return acc;
  }, {
    totalBooks: 0,
    genreCount: {} as Record<string, number>,
    totalRating: 0,
  });

  const averageRating = stats.totalBooks > 0 
    ? (stats.totalRating / stats.totalBooks).toFixed(1) 
    : '0.0';

  if (loading) return <div className="text-center py-8">Loading books...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Stats and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Books</p>
          <p className="text-2xl font-bold">{stats.totalBooks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Average Rating</p>
          <p className="text-2xl font-bold">{averageRating} ★</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Genres</p>
          <p className="text-2xl font-bold">{Object.keys(stats.genreCount).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Actions</p>
          <button
            onClick={fetchBooks}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
        <input
          type="text"
          placeholder="Search books or authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Genres</option>
          {Object.keys(stats.genreCount).map(genre => (
            <option key={genre} value={genre}>
              {genre} ({stats.genreCount[genre]})
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="title">Sort by Title</option>
          <option value="year">Sort by Year</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBooks.map(book => (
          <div key={book.id} className="relative">
            <BookCard book={book} />
            <button
              onClick={() => handleDelete(book.id)}
              className="absolute top-4 right-4 p-2 text-red-600 hover:text-red-800"
              title="Delete book"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {sortedBooks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No books found. {search && 'Try adjusting your search.'}
        </div>
      )}
    </div>
  );
}
```

### **4.4 Book Form Component**
```tsx
// components/BookForm.tsx
'use client';

import { useState } from 'react';
import { Book, BookFormData } from '@/lib/types';

interface BookFormProps {
  initialData?: Partial<Book>;
  onSubmit: (data: BookFormData) => Promise<void>;
  isLoading?: boolean;
}

const genres = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy',
  'Mystery', 'Biography', 'History', 'Self-Help', 'Business'
];

export default function BookForm({ initialData, onSubmit, isLoading }: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>({
    title: initialData?.title || '',
    author: initialData?.author || '',
    description: initialData?.description || '',
    publishedYear: initialData?.publishedYear || new Date().getFullYear(),
    genre: initialData?.genre || genres[0],
    rating: initialData?.rating || 3,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publishedYear' || name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter book title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author *
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter author name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter book description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Published Year
          </label>
          <input
            type="number"
            name="publishedYear"
            value={formData.publishedYear}
            onChange={handleChange}
            min="1000"
            max="2024"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genre
          </label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating (1-5)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-yellow-600">
              {formData.rating} ★
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
}
```

### **4.5 Pages Implementation**

```tsx
// app/books/page.tsx
import Link from 'next/link';
import BookList from '@/components/BookList';

export default function BooksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Book Library</h1>
          <p className="text-gray-600 mt-2">Manage your collection of books</p>
        </div>
        <Link
          href="/add-book"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          + Add New Book
        </Link>
      </div>
      
      <BookList />
    </div>
  );
}
```

```tsx
// app/add-book/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BookForm from '@/components/BookForm';
import { BookFormData } from '@/lib/types';

export default function AddBookPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: BookFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Book added successfully!');
        router.push('/books');
        router.refresh();
      } else {
        alert(result.error || 'Failed to add book');
      }
    } catch (error) {
      alert('Failed to add book');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
        <p className="text-gray-600 mt-2">Fill in the details to add a new book to your library</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <BookForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
```

```tsx
// app/books/[id]/page.tsx
interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  
  const response = await fetch(`http://localhost:3000/api/books/${id}`, {
    cache: 'no-store',
  });
  const result = await response.json();
  
  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Book Not Found</h1>
          <p className="text-gray-600 mt-2">The requested book could not be found.</p>
        </div>
      </div>
    );
  }
  
  const book = result.data;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                <p className="text-xl text-gray-600 mt-2">by {book.author}</p>
              </div>
              <div className="text-4xl text-yellow-400">
                {'★'.repeat(Math.floor(book.rating))}
                {'☆'.repeat(5 - Math.floor(book.rating))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Genre</p>
                <p className="text-lg font-semibold">{book.genre}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Published Year</p>
                <p className="text-lg font-semibold">{book.publishedYear}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Added On</p>
                <p className="text-lg font-semibold">
                  {new Date(book.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
            
            <div className="flex space-x-4">
              <a
                href={`/books/${book.id}/edit`}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Book
              </a>
              <a
                href="/books"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Back to Library
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

```tsx
// app/books/[id]/edit/page.tsx
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BookForm from '@/components/BookForm';
import { Book, BookFormData } from '@/lib/types';

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/books/${id}`);
      const result = await response.json();
      
      if (result.success) {
        setBook(result.data);
      } else {
        router.push('/books');
      }
    } catch (error) {
      console.error('Failed to fetch book:', error);
      router.push('/books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: BookFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Book updated successfully!');
        router.push(`/books/${id}`);
        router.refresh();
      } else {
        alert(result.error || 'Failed to update book');
      }
    } catch (error) {
      alert('Failed to update book');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading book details...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Book Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Book</h1>
        <p className="text-gray-600 mt-2">Update the details of "{book.title}"</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <BookForm 
          initialData={book}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
```

### **4.6 Main Layout**
```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Book Library CRUD',
  description: 'A CRUD application for managing books',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>Book Library CRUD Application • Built with Next.js, TypeScript & Tailwind CSS</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
```

```tsx
// components/Navigation.tsx
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              📚 BookLib
            </Link>
          </div>
          
          <div className="flex space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/books"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Books
            </Link>
            <Link
              href="/add-book"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Add Book
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

## 📊 **Part 5: Advanced Concepts**

### **5.1 Using useOptimistic and useTransition**
```tsx
// components/OptimisticBookList.tsx
'use client';

import { useOptimistic, useTransition } from 'react';
import { Book } from '@/lib/types';

interface OptimisticBookListProps {
  books: Book[];
}

export default function OptimisticBookList({ books }: OptimisticBookListProps) {
  const [optimisticBooks, setOptimisticBooks] = useOptimistic(books);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      // Optimistically update UI
      setOptimisticBooks(optimisticBooks.filter(book => book.id !== id));
      
      // Actually delete from server
      await fetch(`/api/books/${id}`, { method: 'DELETE' });
    });
  };

  return (
    <div className={`${isPending ? 'opacity-70' : ''}`}>
      {/* Render optimisticBooks */}
    </div>
  );
}
```

### **5.2 Using useCache for Data Fetching**
```typescript
// Using React cache for memoization
import { cache } from 'react';

export const getBooks = cache(async () => {
  // This will be cached across requests
  return fetch('/api/books').then(res => res.json());
});
```

### **5.3 Error Boundaries and Loading States**
```tsx
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium">Something went wrong</h3>
          <p className="text-red-600 text-sm mt-1">
            {this.state.error?.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 🎯 **Part 6: Task Summary & Learning Outcomes**

### **6.1 What You've Built**
✅ **Full CRUD Application** with books management
✅ **RESTful API** endpoints in Next.js
✅ **Dynamic routing** for individual books and editing
✅ **TypeScript** implementation with proper types
✅ **Responsive UI** with Tailwind CSS
✅ **Array operations** (map, filter, reduce)
✅ **Client & Server components** usage
✅ **Data fetching** patterns

### **6.2 Key Concepts Mastered**

1. **TypeScript**:
   - Interface definitions
   - Type safety
   - Generic types

2. **Next.js**:
   - App Router structure
   - API Routes
   - Dynamic routes `[id]`
   - Server vs Client components
   - Data fetching patterns

3. **React Hooks**:
   - useState, useEffect
   - useOptimistic, useTransition
   - Custom hooks patterns

4. **Array Methods**:
   - `map()`: Transform data for display
   - `filter()`: Search and filter functionality
   - `reduce()`: Statistics and aggregations
   - `sort()`: Ordering data

5. **Tailwind CSS**:
   - Utility-first styling
   - Responsive design
   - Component styling patterns

### **6.3 Best Practices Implemented**
- Type safety throughout
- Separation of concerns
- Error handling
- Loading states
- Optimistic updates
- Code organization
- Reusable components

## 🚀 **Next Steps & Enhancements**

### **7.1 Add These Features:**
1. **Pagination** for large book lists
2. **Authentication** for multi-user support
3. **Persistent storage** with database (PostgreSQL, MongoDB)
4. **Image uploads** for book covers
5. **Export/Import** functionality
6. **Advanced filtering** and searching
7. **Dark mode** toggle
8. **Data validation** with Zod

### **7.2 Advanced Learning:**
```typescript
// 1. Server Actions
'use server';

export async function deleteBookAction(id: string) {
  // Server action for deleting
}

// 2. Middleware for authentication
// 3. Database integration with Prisma/Drizzle
// 4. Testing with Jest/React Testing Library
// 5. Deployment on Vercel
```

## 📖 **Quick Start Guide**

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   ```
   http://localhost:3000
   ```

4. **Navigate through**:
   - Home: `/`
   - Books list: `/books`
   - Add book: `/add-book`
   - View book: `/books/[id]`
   - Edit book: `/books/[id]/edit`
   - API: `/api/books`

## 🎓 **Learning Resources**

1. **Next.js Documentation**: https://nextjs.org/docs
2. **Tailwind CSS**: https://tailwindcss.com/docs
3. **TypeScript Handbook**: https://www.typescriptlang.org/docs/
4. **React Docs**: https://react.dev



# 🎨 Tailwind CSS 101: Complete Cheat Sheet

## 📋 **Core Concepts**

### **1. Utility-First Approach**
Instead of writing custom CSS classes, you use pre-defined utility classes.

## 📊 **Complete Tailwind CSS Properties Table**

| Category | Property | Tailwind Class | Example | What It Does |
|----------|----------|----------------|---------|--------------|
| **Layout** | Display | `block`, `inline`, `flex`, `grid`, `inline-block`, `hidden` | `<div class="flex">` | Sets display property |
| | | `inline-flex`, `inline-grid`, `table` | | |
| **Flexbox** | Flex Direction | `flex-row`, `flex-row-reverse`, `flex-col`, `flex-col-reverse` | `<div class="flex flex-col">` | Controls direction of flex items |
| | Justify Content | `justify-start`, `justify-end`, `justify-center`, `justify-between`, `justify-around`, `justify-evenly` | `<div class="flex justify-between">` | Aligns items along main axis |
| | Align Items | `items-start`, `items-end`, `items-center`, `items-baseline`, `items-stretch` | `<div class="flex items-center">` | Aligns items along cross axis |
| | Align Self | `self-auto`, `self-start`, `self-end`, `self-center`, `self-stretch` | `<div class="self-center">` | Overrides align-items for single item |
| | Flex Wrap | `flex-wrap`, `flex-wrap-reverse`, `flex-nowrap` | `<div class="flex flex-wrap">` | Controls whether items wrap |
| | Flex Grow/Shrink | `flex-1`, `flex-auto`, `flex-initial`, `flex-none`, `grow`, `grow-0`, `shrink`, `shrink-0` | `<div class="flex-1">` | Controls item flexibility |
| **Grid** | Grid Template | `grid`, `grid-cols-1` to `12`, `grid-rows-1` to `6` | `<div class="grid grid-cols-3">` | Creates grid with specified columns |
| | | `grid-flow-row`, `grid-flow-col`, `grid-flow-dense` | | |
| | Gap | `gap-0` to `96`, `gap-x-*`, `gap-y-*` | `<div class="grid gap-4">` | Space between grid items |
| | Column/Row Span | `col-span-1` to `12`, `row-span-1` to `6` | `<div class="col-span-2">` | Item spans multiple columns/rows |
| | Grid Placement | `col-start-1` to `13`, `row-start-1` to `7` | `<div class="col-start-2">` | Specific grid placement |
| **Spacing** | Margin | `m-0` to `96`, `mx-*`, `my-*`, `mt-*`, `mb-*`, `ml-*`, `mr-*` | `<div class="m-4">` | Adds margin (4 = 1rem) |
| | Padding | `p-0` to `96`, `px-*`, `py-*`, `pt-*`, `pb-*`, `pl-*`, `pr-*` | `<div class="p-4">` | Adds padding |
| | Space Between | `space-x-*`, `space-y-*`, `space-x-reverse`, `space-y-reverse` | `<div class="space-y-4">` | Space between child elements |
| **Sizing** | Width | `w-0` to `96`, `w-auto`, `w-full`, `w-screen`, `w-min`, `w-max`, `w-fit` | `<div class="w-64">` | Sets width (64 = 16rem) |
| | Height | `h-0` to `96`, `h-auto`, `h-full`, `h-screen`, `h-min`, `h-max`, `h-fit` | `<div class="h-32">` | Sets height |
| | Min/Max | `min-w-0`, `min-w-full`, `max-w-xs` to `7xl`, `min-h-0`, `min-h-full`, `max-h-*` | `<div class="max-w-4xl">` | Sets min/max dimensions |
| **Typography** | Font Size | `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` to `9xl` | `<h1 class="text-3xl">` | Sets font size |
| | Font Weight | `font-thin`, `font-extralight`, `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `font-extrabold`, `font-black` | `<p class="font-bold">` | Sets font weight |
| | Font Family | `font-sans`, `font-serif`, `font-mono` | `<code class="font-mono">` | Sets font family |
| | Text Align | `text-left`, `text-center`, `text-right`, `text-justify` | `<p class="text-center">` | Aligns text horizontally |
| | Text Color | `text-{color}-{shade}` | `<p class="text-blue-600">` | Sets text color |
| | Text Decoration | `underline`, `line-through`, `no-underline` | `<a class="underline">` | Text decoration |
| | Text Transform | `uppercase`, `lowercase`, `capitalize`, `normal-case` | `<span class="uppercase">` | Transforms text case |
| | Letter Spacing | `tracking-tighter`, `tracking-tight`, `tracking-normal`, `tracking-wide`, `tracking-wider`, `tracking-widest` | `<h1 class="tracking-wide">` | Letter spacing |
| | Line Height | `leading-3` to `10`, `leading-none`, `leading-tight`, `leading-snug`, `leading-normal`, `leading-relaxed`, `leading-loose` | `<p class="leading-relaxed">` | Line height |
| | List Style | `list-none`, `list-disc`, `list-decimal` | `<ul class="list-disc">` | List bullet style |
| **Colors** | Background | `bg-{color}-{shade}`, `bg-transparent`, `bg-current` | `<div class="bg-gray-100">` | Background color |
| | Text | `text-{color}-{shade}`, `text-transparent`, `text-current` | `<p class="text-gray-800">` | Text color |
| | Border | `border-{color}-{shade}` | `<div class="border-red-500">` | Border color |
| | Divide | `divide-{color}-{shade}` | `<div class="divide-gray-200">` | Color between elements |
| | Ring | `ring-{color}-{shade}` | `<button class="ring-blue-500">` | Outline ring color |
| **Borders** | Border Width | `border`, `border-0` to `8`, `border-t-*`, `border-b-*`, `border-l-*`, `border-r-*` | `<div class="border-2">` | Border thickness |
| | Border Radius | `rounded`, `rounded-none`, `rounded-sm` to `3xl`, `rounded-t-*`, `rounded-b-*`, `rounded-l-*`, `rounded-r-*`, `rounded-tl-*`, etc. | `<div class="rounded-lg">` | Border rounding |
| | Border Style | `border-solid`, `border-dashed`, `border-dotted`, `border-double`, `border-none` | `<div class="border-dashed">` | Border style |
| | Border Color | `border-{color}-{shade}`, `border-transparent`, `border-current` | `<div class="border-gray-300">` | Border color |
| **Effects** | Box Shadow | `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, `shadow-inner`, `shadow-none` | `<div class="shadow-lg">` | Adds box shadow |
| | Opacity | `opacity-0` to `100` | `<div class="opacity-50">` | Sets opacity (0-100%) |
| | Mix Blend | `mix-blend-normal`, `mix-blend-multiply`, `mix-blend-screen`, etc. | `<div class="mix-blend-multiply">` | Blend mode |
| **Backgrounds** | Gradient | `bg-gradient-to-{direction}`, `from-{color}`, `via-{color}`, `to-{color}` | `<div class="bg-gradient-to-r from-blue-500 to-purple-600">` | Creates gradient |
| | Background Size | `bg-auto`, `bg-cover`, `bg-contain` | `<div class="bg-cover">` | Controls background image size |
| | Background Position | `bg-{position}` (top, bottom, left, right, center) | `<div class="bg-center">` | Background position |
| | Background Repeat | `bg-repeat`, `bg-no-repeat`, `bg-repeat-x`, `bg-repeat-y`, `bg-repeat-round`, `bg-repeat-space` | `<div class="bg-no-repeat">` | Background repeat |
| **Filters** | Blur | `blur-0` to `xl`, `blur-sm`, `blur-md`, `blur-lg` | `<div class="blur-sm">` | Applies blur filter |
| | Brightness | `brightness-0` to `200` | `<div class="brightness-75">` | Adjusts brightness |
| | Contrast | `contrast-0` to `200` | `<div class="contrast-125">` | Adjusts contrast |
| | Grayscale | `grayscale-0`, `grayscale` | `<div class="grayscale">` | Applies grayscale |
| | Hue Rotate | `hue-rotate-0` to `360` | `<div class="hue-rotate-90">` | Rotates hue |
| | Invert | `invert-0`, `invert` | `<div class="invert">` | Inverts colors |
| | Saturate | `saturate-0` to `200` | `<div class="saturate-150">` | Adjusts saturation |
| | Sepia | `sepia-0`, `sepia` | `<div class="sepia">` | Applies sepia |
| **Transitions** | Transition | `transition`, `transition-all`, `transition-colors`, `transition-opacity`, `transition-shadow`, `transition-transform` | `<button class="transition-colors">` | Enables transitions |
| | Duration | `duration-75` to `1000` | `<div class="duration-300">` | Transition duration in ms |
| | Timing | `ease-linear`, `ease-in`, `ease-out`, `ease-in-out` | `<div class="ease-in-out">` | Transition timing function |
| | Delay | `delay-75` to `1000` | `<div class="delay-150">` | Transition delay in ms |
| **Transforms** | Scale | `scale-0` to `150`, `scale-x-*`, `scale-y-*` | `<div class="scale-105">` | Scales element |
| | Rotate | `rotate-0` to `360`, `-rotate-*` | `<div class="rotate-45">` | Rotates element |
| | Translate | `translate-x-*`, `translate-y-*` | `<div class="translate-x-4">` | Moves element |
| | Skew | `skew-x-*`, `skew-y-*` | `<div class="skew-x-12">` | Skews element |
| | Transform Origin | `origin-{position}` | `<div class="origin-top">` | Sets transform origin |
| **Interactivity** | Cursor | `cursor-auto`, `cursor-pointer`, `cursor-wait`, `cursor-text`, `cursor-move`, `cursor-not-allowed` | `<button class="cursor-pointer">` | Changes cursor |
| | User Select | `select-none`, `select-text`, `select-all`, `select-auto` | `<div class="select-none">` | Controls text selection |
| | Pointer Events | `pointer-events-none`, `pointer-events-auto` | `<div class="pointer-events-none">` | Controls pointer events |
| | Resize | `resize-none`, `resize`, `resize-y`, `resize-x` | `<textarea class="resize-none">` | Controls resizability |
| **Accessibility** | Screen Reader | `sr-only`, `not-sr-only` | `<span class="sr-only">` | Hides element visually but not from screen readers |
| | Focus | `focus:*`, `focus-within:*`, `focus-visible:*` | `<input class="focus:ring-2">` | Focus states |
| | Hover | `hover:*` | `<button class="hover:bg-blue-700">` | Hover states |
| | Active | `active:*` | `<button class="active:scale-95">` | Active (click) states |
| | Disabled | `disabled:*` | `<button class="disabled:opacity-50">` | Disabled states |

## 🎯 **Responsive Design**

| Breakpoint | Prefix | Width | Example | Purpose |
|------------|---------|-------|---------|----------|
| Default | None | All | `text-lg` | Base styles |
| Small | `sm:` | 640px+ | `sm:text-xl` | Mobile |
| Medium | `md:` | 768px+ | `md:flex-row` | Tablets |
| Large | `lg:` | 1024px+ | `lg:grid-cols-3` | Laptops |
| Extra Large | `xl:` | 1280px+ | `xl:max-w-7xl` | Desktops |
| 2XL | `2xl:` | 1536px+ | `2xl:text-5xl` | Large screens |

**Example:**
```html
<div class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
  <!-- Text size changes at each breakpoint -->
</div>
```

## 🎨 **Color System**

### **Default Colors & Shades**
Each color has shades from 50 (lightest) to 900 (darkest):

| Color | Shades Example | Common Use |
|-------|----------------|------------|
| Gray | `gray-100`, `gray-500`, `gray-900` | Backgrounds, text |
| Blue | `blue-100`, `blue-500`, `blue-900` | Primary actions |
| Red | `red-100`, `red-500`, `red-900` | Errors, alerts |
| Green | `green-100`, `green-500`, `green-900` | Success |
| Yellow | `yellow-100`, `yellow-500`, `yellow-900` | Warnings |
| Purple | `purple-100`, `purple-500`, `purple-900` | Secondary |
| Pink | `pink-100`, `pink-500`, `pink-900` | Accents |

## 📝 **Common Patterns & Examples**

### **1. Card Component**
```html
<div class="max-w-sm rounded-lg shadow-lg bg-white p-6">
  <h3 class="text-xl font-bold text-gray-900 mb-2">Card Title</h3>
  <p class="text-gray-600 mb-4">Card description goes here.</p>
  <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
    Click Me
  </button>
</div>
```

### **2. Flex Navigation Bar**
```html
<nav class="flex items-center justify-between p-4 bg-gray-800">
  <div class="text-white text-xl font-bold">Logo</div>
  <div class="flex space-x-4">
    <a href="#" class="text-gray-300 hover:text-white transition-colors">Home</a>
    <a href="#" class="text-gray-300 hover:text-white transition-colors">About</a>
    <a href="#" class="text-gray-300 hover:text-white transition-colors">Contact</a>
  </div>
</nav>
```

### **3. Grid Layout**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-gray-100 p-4 rounded-lg">Item 1</div>
  <div class="bg-gray-100 p-4 rounded-lg">Item 2</div>
  <div class="bg-gray-100 p-4 rounded-lg">Item 3</div>
</div>
```

### **4. Form Elements**
```html
<div class="space-y-4">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
    <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
  </div>
  <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
    Submit
  </button>
</div>
```

### **5. Responsive Typography**
```html
<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
  Responsive Heading
</h1>
<p class="text-base md:text-lg text-gray-600 mt-2">
  This text scales with screen size
</p>
```

## 🔧 **Customization**

### **1. Extending Tailwind**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary': '#1DA1F2',
        'secondary': '#14171A',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontFamily: {
        'custom': ['Custom Font', 'sans-serif'],
      }
    }
  }
}
```

### **2. Arbitrary Values**
```html
<!-- Using arbitrary values -->
<div class="top-[117px]">
<div class="bg-[#1da1f2]">
<div class="text-[13px]">
```

## 🎓 **Quick Reference Rules**

### **Naming Pattern:**
```
{property}-{value}
```

### **Size Scale:**
- `0` = 0px
- `1` = 0.25rem (4px)
- `2` = 0.5rem (8px)
- `3` = 0.75rem (12px)
- `4` = 1rem (16px) ← **Base unit**
- `5` = 1.25rem (20px)
- `6` = 1.5rem (24px)
- `8` = 2rem (32px)
- `10` = 2.5rem (40px)
- `12` = 3rem (48px)
- `16` = 4rem (64px)

### **Important Rules:**
1. **Mobile-first**: Base styles are for mobile, prefixes for larger screens
2. **Order matters**: Later classes override earlier ones
3. **Responsive prefixes**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
4. **State variants**: `hover:`, `focus:`, `active:`, `disabled:`
5. **Dark mode**: `dark:` prefix for dark mode styles

### **Common Shorthands:**
- `m-4` = margin: 1rem
- `p-4` = padding: 1rem
- `mx-auto` = margin-left: auto; margin-right: auto;
- `flex-1` = flex: 1 1 0%;
- `rounded-lg` = border-radius: 0.5rem;

## 💡 **Pro Tips**

1. **Group related utilities**: Use line breaks to group spacing, typography, etc.
2. **Use @apply for repetition**: Extract repeated patterns
3. **Keep responsive together**: Group all breakpoint variants
4. **Use arbitrary values sparingly**: Stick to design system when possible
5. **Learn common patterns**: Cards, buttons, forms, grids

## 🚀 **Practice Exercise**

Create this component using Tailwind:
```html
<div class="max-w-md mx-auto mt-8">
  <div class="bg-white rounded-xl shadow-lg p-6">
    <div class="flex items-center space-x-4 mb-4">
      <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        <span class="text-blue-600 font-bold text-xl">A</span>
      </div>
      <div>
        <h3 class="font-bold text-gray-900">Amazing Card</h3>
        <p class="text-gray-500 text-sm">Created just now</p>
      </div>
    </div>
    <p class="text-gray-700 mb-4">
      This is an example of a beautiful card component built with Tailwind CSS.
    </p>
    <div class="flex justify-between items-center">
      <button class="text-blue-600 hover:text-blue-800 font-medium">
        Learn More →
      </button>
      <div class="flex space-x-2">
        <span class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
          Design
        </span>
        <span class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
          Tailwind
        </span>
      </div>
    </div>
  </div>
</div>
```



# 📚 Complete Book CRUD Application - Full Code

## 📁 **Project Structure**
```
book-crud-app/
├── app/
│   ├── api/
│   │   └── books/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── books/
│   │   ├── [id]/
│   │   │   ├── page.tsx
│   │   │   └── edit/
│   │   │       └── page.tsx
│   │   └── page.tsx
│   ├── add-book/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BookCard.tsx
│   ├── BookForm.tsx
│   ├── BookList.tsx
│   ├── Navigation.tsx
│   └── StatsCard.tsx
├── lib/
│   ├── types.ts
│   └── books-data.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 📄 **File 1: package.json**
```json
{
  "name": "book-crud-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "uuid": "^9.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.309.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/uuid": "^9.0.0",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

## 📄 **File 2: tailwind.config.ts**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
```

## 📄 **File 3: app/globals.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
  }

  body {
    @apply antialiased text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white font-medium py-2 px-4 rounded-lg 
           hover:bg-primary-700 transition-colors duration-200 
           focus:outline-none focus:ring-2 focus:ring-primary-500 
           focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-secondary {
    @apply bg-white text-gray-700 font-medium py-2 px-4 rounded-lg 
           border border-gray-300 hover:bg-gray-50 transition-colors 
           duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 
           focus:ring-offset-2;
  }

  .card {
    @apply bg-white rounded-xl shadow-md border border-gray-200 
           hover:shadow-lg transition-shadow duration-300;
  }

  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg 
           focus:outline-none focus:ring-2 focus:ring-primary-500 
           focus:border-transparent transition-all duration-200;
  }

  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
           font-medium;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}
```

## 📄 **File 4: lib/types.ts**
```typescript
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  genre: string;
  rating: number;
  isbn?: string;
  pages?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BookFormData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
export type BookCreateData = Omit<BookFormData, 'createdAt' | 'updatedAt'>;
export type BookUpdateData = Partial<BookFormData>;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
}

export interface Stats {
  totalBooks: number;
  totalPages: number;
  averageRating: number;
  genres: Record<string, number>;
  byYear: Record<number, number>;
}

export type SortOption = 'title' | 'author' | 'year' | 'rating' | 'genre';
export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  search: string;
  genre: string;
  minRating: number;
  maxYear: number;
  minYear: number;
}
```

## 📄 **File 5: lib/books-data.ts**
```typescript
'use server';

import { Book, BookCreateData, BookUpdateData, Stats } from './types';
import { v4 as uuidv4 } from 'uuid';

// Initial books data
let books: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic novel of the Jazz Age, exploring themes of idealism, resistance to change, social upheaval, and excess.',
    publishedYear: 1925,
    genre: 'Classic',
    rating: 4.5,
    isbn: '9780743273565',
    pages: 180,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.',
    publishedYear: 1960,
    genre: 'Fiction',
    rating: 4.8,
    isbn: '9780061120084',
    pages: 281,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.',
    publishedYear: 1949,
    genre: 'Science Fiction',
    rating: 4.7,
    isbn: '9780451524935',
    pages: 328,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel of manners that depicts the emotional development of protagonist Elizabeth Bennet.',
    publishedYear: 1813,
    genre: 'Romance',
    rating: 4.6,
    isbn: '9780141439518',
    pages: 432,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'A fantasy novel about the adventures of hobbit Bilbo Baggins in Middle-earth.',
    publishedYear: 1937,
    genre: 'Fantasy',
    rating: 4.9,
    isbn: '9780547928227',
    pages: 310,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '6',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'A practical guide to building good habits and breaking bad ones with proven strategies.',
    publishedYear: 2018,
    genre: 'Self-Help',
    rating: 4.7,
    isbn: '9780735211292',
    pages: 320,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
];

// Simulate delay for realistic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all books with optional filters
export async function getBooks(filters?: {
  search?: string;
  genre?: string;
  minRating?: number;
}): Promise<Book[]> {
  await delay(300); // Simulate network delay
  
  let filteredBooks = [...books];
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters?.genre && filters.genre !== 'all') {
    filteredBooks = filteredBooks.filter(book => book.genre === filters.genre);
  }
  
  if (filters?.minRating) {
    filteredBooks = filteredBooks.filter(book => book.rating >= filters.minRating!);
  }
  
  return filteredBooks;
}

// Get a single book by ID
export async function getBook(id: string): Promise<Book | undefined> {
  await delay(200);
  return books.find(book => book.id === id);
}

// Add a new book
export async function addBook(bookData: BookCreateData): Promise<Book> {
  await delay(400);
  
  const newBook: Book = {
    ...bookData,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  books.push(newBook);
  return newBook;
}

// Update a book
export async function updateBook(id: string, updates: BookUpdateData): Promise<Book | undefined> {
  await delay(400);
  
  const index = books.findIndex(book => book.id === id);
  if (index === -1) return undefined;
  
  books[index] = {
    ...books[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  return books[index];
}

// Delete a book
export async function deleteBook(id: string): Promise<boolean> {
  await delay(300);
  
  const initialLength = books.length;
  books = books.filter(book => book.id !== id);
  return books.length < initialLength;
}

// Get statistics
export async function getStats(): Promise<Stats> {
  await delay(200);
  
  const stats: Stats = {
    totalBooks: books.length,
    totalPages: books.reduce((sum, book) => sum + (book.pages || 0), 0),
    averageRating: books.length > 0 
      ? Number((books.reduce((sum, book) => sum + book.rating, 0) / books.length).toFixed(1))
      : 0,
    genres: {},
    byYear: {},
  };
  
  // Calculate genre distribution
  books.forEach(book => {
    stats.genres[book.genre] = (stats.genres[book.genre] || 0) + 1;
    stats.byYear[book.publishedYear] = (stats.byYear[book.publishedYear] || 0) + 1;
  });
  
  return stats;
}

// Get all unique genres
export async function getGenres(): Promise<string[]> {
  await delay(100);
  return [...new Set(books.map(book => book.genre))];
}

// Get recent books
export async function getRecentBooks(limit: number = 5): Promise<Book[]> {
  await delay(200);
  return [...books]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}
```

## 📄 **File 6: app/layout.tsx**
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import { BookOpen } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Book Library | CRUD Application',
  description: 'A complete CRUD application for managing books built with Next.js, TypeScript, and Tailwind CSS',
  keywords: ['books', 'library', 'crud', 'nextjs', 'typescript', 'tailwind'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <Navigation />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <footer className="bg-gray-900 text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <BookOpen className="h-6 w-6 text-primary-400" />
                <span className="text-xl font-bold">BookLib</span>
              </div>
              
              <div className="text-center md:text-left">
                <p className="text-gray-400">
                  © {new Date().getFullYear()} Book Library CRUD Application
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Built with Next.js 14, TypeScript & Tailwind CSS
                </p>
              </div>
              
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a 
                  href="https://nextjs.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Next.js
                </a>
                <a 
                  href="https://typescriptlang.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  TypeScript
                </a>
                <a 
                  href="https://tailwindcss.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tailwind
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
```

## 📄 **File 7: components/Navigation.tsx**
```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, X, Home, Plus, List, Search } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/books', label: 'Books', icon: List },
    { href: '/add-book', label: 'Add Book', icon: Plus },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <div>
              <span className="text-xl font-bold text-gray-900">BookLib</span>
              <span className="text-xs text-primary-600 font-medium block -mt-1">
                CRUD Demo
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
```

## 📄 **File 8: components/BookCard.tsx**
```typescript
import { Book } from '@/lib/types';
import Link from 'next/link';
import { Star, Calendar, BookOpen, User } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export default function BookCard({ book, onDelete, compact = false }: BookCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && confirm(`Delete "${book.title}"?`)) {
      onDelete(book.id);
    }
  };

  if (compact) {
    return (
      <Link href={`/books/${book.id}`}>
        <div className="card p-4 hover:border-primary-200 transition-all duration-200">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
              <p className="text-sm text-gray-600 mt-1 truncate">by {book.author}</p>
            </div>
            <div className="flex items-center ml-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium ml-1">{book.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="card overflow-hidden group">
      <Link href={`/books/${book.id}`}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                {book.title}
              </h3>
              <div className="flex items-center mt-1 space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{book.author}</span>
              </div>
            </div>
            
            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="ml-1 font-bold text-yellow-700">{book.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-gray-700 line-clamp-2 mb-4">{book.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge bg-blue-100 text-blue-800">
              {book.genre}
            </span>
            {book.pages && (
              <span className="badge bg-gray-100 text-gray-800 flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                {book.pages} pages
              </span>
            )}
            <span className="badge bg-gray-100 text-gray-800 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {book.publishedYear}
            </span>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <Link
                href={`/books/${book.id}/edit`}
                className="btn-secondary text-sm py-1 px-3"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="text-sm py-1 px-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            
            <span className="text-xs text-gray-500">
              Updated: {new Date(book.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
```

## 📄 **File 9: components/BookForm.tsx**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Book, BookFormData } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface BookFormProps {
  initialData?: Partial<Book>;
  onSubmit: (data: BookFormData) => Promise<void>;
  isLoading?: boolean;
  submitText?: string;
}

const genres = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Biography',
  'History',
  'Self-Help',
  'Business',
  'Romance',
  'Classic',
  'Technology',
  'Science',
  'Art',
  'Poetry',
];

const currentYear = new Date().getFullYear();

export default function BookForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitText = 'Save Book',
}: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>({
    title: initialData?.title || '',
    author: initialData?.author || '',
    description: initialData?.description || '',
    publishedYear: initialData?.publishedYear || currentYear,
    genre: initialData?.genre || genres[0],
    rating: initialData?.rating || 3,
    isbn: initialData?.isbn || '',
    pages: initialData?.pages || undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData?.title || '',
        author: initialData?.author || '',
        description: initialData?.description || '',
        publishedYear: initialData?.publishedYear || currentYear,
        genre: initialData?.genre || genres[0],
        rating: initialData?.rating || 3,
        isbn: initialData?.isbn || '',
        pages: initialData?.pages || undefined,
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (formData.publishedYear < 1000 || formData.publishedYear > currentYear) {
      newErrors.publishedYear = `Year must be between 1000 and ${currentYear}`;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    if (formData.pages && formData.pages < 1) {
      newErrors.pages = 'Pages must be positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'publishedYear' || name === 'rating' || name === 'pages'
          ? value === '' ? '' : Number(value)
          : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Book Details</h2>
          <p className="text-gray-600">Fill in the details of your book</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input-field ${errors.title ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Enter book title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={`input-field ${errors.author ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="Enter author name"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input-field resize-none"
            placeholder="Enter book description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Published Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Published Year *
            </label>
            <input
              type="number"
              name="publishedYear"
              value={formData.publishedYear}
              onChange={handleChange}
              min="1000"
              max={currentYear}
              className={`input-field ${errors.publishedYear ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {errors.publishedYear && (
              <p className="mt-1 text-sm text-red-600">{errors.publishedYear}</p>
            )}
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre *
            </label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="input-field"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating ({formData.rating})
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                name="rating"
                min="1"
                max="5"
                step="0.5"
                value={formData.rating}
                onChange={handleChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${
                      i < Math.floor(formData.rating)
                        ? 'text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
            )}
          </div>

          {/* Pages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pages (Optional)
            </label>
            <input
              type="number"
              name="pages"
              value={formData.pages || ''}
              onChange={handleChange}
              min="1"
              className={`input-field ${errors.pages ? 'border-red-300 focus:ring-red-500' : ''}`}
            />
            {errors.pages && (
              <p className="mt-1 text-sm text-red-600">{errors.pages}</p>
            )}
          </div>
        </div>

        {/* ISBN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ISBN (Optional)
          </label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., 978-3-16-148410-0"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex items-center justify-center min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
}
```

## 📄 **File 10: components/BookList.tsx**
```typescript
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Book, SortOption, SortOrder } from '@/lib/types';
import BookCard from './BookCard';
import { Search, Filter, Grid, List, ChevronUp, ChevronDown } from 'lucide-react';

interface BookListProps {
  initialBooks?: Book[];
  showFilters?: boolean;
  onRefresh?: () => void;
}

export default function BookList({ initialBooks, showFilters = true, onRefresh }: BookListProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks || []);
  const [loading, setLoading] = useState(!initialBooks);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Fetch books
  useEffect(() => {
    if (!initialBooks) {
      fetchBooks();
    }
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/books');
      const data = await response.json();
      
      if (data.success) {
        setBooks(data.data);
      } else {
        setError(data.error || 'Failed to fetch books');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setBooks(books.filter(book => book.id !== id));
      } else {
        alert(data.error || 'Failed to delete book');
      }
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  // Get unique genres using Set and map
  const genres = useMemo(() => {
    const uniqueGenres = new Set(books.map(book => book.genre));
    return ['all', ...Array.from(uniqueGenres)];
  }, [books]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        const matchesSearch = search === '' || 
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase());
        
        const matchesGenre = genre === 'all' || book.genre === genre;
        const matchesRating = book.rating >= minRating;
        
        return matchesSearch && matchesGenre && matchesRating;
      })
      .sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'author':
            aValue = a.author.toLowerCase();
            bValue = b.author.toLowerCase();
            break;
          case 'year':
            aValue = a.publishedYear;
            bValue = b.publishedYear;
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'genre':
            aValue = a.genre.toLowerCase();
            bValue = b.genre.toLowerCase();
            break;
          default:
            return 0;
        }
        
        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
  }, [books, search, genre, minRating, sortBy, sortOrder]);

  // Calculate statistics using reduce
  const stats = useMemo(() => {
    return books.reduce((acc, book) => {
      acc.totalBooks++;
      acc.totalPages += book.pages || 0;
      acc.totalRating += book.rating;
      acc.genres[book.genre] = (acc.genres[book.genre] || 0) + 1;
      return acc;
    }, {
      totalBooks: 0,
      totalPages: 0,
      totalRating: 0,
      genres: {} as Record<string, number>,
    });
  }, [books]);

  const averageRating = stats.totalBooks > 0 
    ? (stats.totalRating / stats.totalBooks).toFixed(1)
    : '0.0';

  const toggleSort = (field: SortOption) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortButton = ({ field, children }: { field: SortOption; children: React.ReactNode }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
        sortBy === field
          ? 'bg-primary-50 text-primary-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span>{children}</span>
      {sortBy === field && (
        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
          <span className="text-xl">!</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Books</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchBooks}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-sm text-gray-600 mb-1">Total Books</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalBooks}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-600 mb-1">Average Rating</div>
          <div className="flex items-center">
            <div className="text-2xl font-bold text-gray-900 mr-2">{averageRating}</div>
            <div className="text-yellow-500 flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(Number(averageRating)) ? 'text-yellow-500' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-600 mb-1">Total Pages</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalPages.toLocaleString()}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-600 mb-1">Genres</div>
          <div className="text-2xl font-bold text-gray-900">{Object.keys(stats.genres).length}</div>
        </div>
      </div>

      {showFilters && (
        <>
          {/* Search Bar */}
          <div className="card p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search books by title, author, or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {genres.map(g => (
                    <option key={g} value={g}>
                      {g === 'all' ? 'All Genres' : g}
                    </option>
                  ))}
                </select>
                
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={0}>All Ratings</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
                
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
                
                <button
                  onClick={onRefresh || fetchBooks}
                  className="btn-secondary"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-700 font-medium py-2">Sort by:</span>
            <SortButton field="title">Title</SortButton>
            <SortButton field="author">Author</SortButton>
            <SortButton field="year">Year</SortButton>
            <SortButton field="rating">Rating</SortButton>
            <SortButton field="genre">Genre</SortButton>
          </div>
        </>
      )}

      {/* Books Grid/List */}
      {filteredBooks.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={handleDelete}
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 mb-4">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 mb-4">
            {search || genre !== 'all' || minRating > 0
              ? 'Try adjusting your search filters'
              : 'Add your first book to get started'
            }
          </p>
          {(search || genre !== 'all' || minRating > 0) && (
            <button
              onClick={() => {
                setSearch('');
                setGenre('all');
                setMinRating(0);
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Results Info */}
      {filteredBooks.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredBooks.length} of {books.length} books
          {(search || genre !== 'all' || minRating > 0) && (
            <span className="ml-1">
              (filtered)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
```

## 📄 **File 11: components/StatsCard.tsx**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { BarChart3, BookOpen, Star, TrendingUp } from 'lucide-react';

interface Stats {
  totalBooks: number;
  totalPages: number;
  averageRating: number;
  genres: Record<string, number>;
  byYear: Record<number, number>;
}

export default function StatsCard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/books/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  // Find most common genre
  const mostCommonGenre = Object.entries(stats.genres)
    .sort(([, a], [, b]) => b - a)[0] || ['N/A', 0];

  // Find average publication year
  const years = Object.keys(stats.byYear).map(Number);
  const avgYear = years.length > 0
    ? Math.round(years.reduce((a, b) => a + b, 0) / years.length)
    : 0;

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks.toLocaleString(),
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Pages',
      value: stats.totalPages.toLocaleString(),
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Popular Genre',
      value: mostCommonGenre[0],
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      subValue: `${mostCommonGenre[1]} books`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="card p-6 hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.subValue && (
                  <p className="text-xs text-gray-500 mt-1">{stat.subValue}</p>
                )}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Avg. Year: {avgYear || 'N/A'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

## 📄 **File 12: app/api/books/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { 
  getBooks, 
  addBook, 
  getStats, 
  getGenres, 
  getRecentBooks 
} from '@/lib/books-data';
import { BookCreateData } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check for specific endpoints
    const endpoint = searchParams.get('endpoint');
    
    if (endpoint === 'stats') {
      const stats = await getStats();
      return NextResponse.json({
        success: true,
        data: stats,
        timestamp: Date.now(),
      });
    }
    
    if (endpoint === 'genres') {
      const genres = await getGenres();
      return NextResponse.json({
        success: true,
        data: genres,
        timestamp: Date.now(),
      });
    }
    
    if (endpoint === 'recent') {
      const limit = parseInt(searchParams.get('limit') || '5');
      const recentBooks = await getRecentBooks(limit);
      return NextResponse.json({
        success: true,
        data: recentBooks,
        timestamp: Date.now(),
      });
    }
    
    // Regular books fetch with filters
    const search = searchParams.get('search') || undefined;
    const genre = searchParams.get('genre') || undefined;
    const minRating = searchParams.get('minRating') 
      ? parseFloat(searchParams.get('minRating')!) 
      : undefined;
    
    const books = await getBooks({ search, genre, minRating });
    
    return NextResponse.json({
      success: true,
      data: books,
      count: books.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('GET /api/books error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch books',
      timestamp: Date.now(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BookCreateData = await request.json();
    
    // Validation
    if (!body.title?.trim() || !body.author?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Title and author are required',
        timestamp: Date.now(),
      }, { status: 400 });
    }
    
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5',
        timestamp: Date.now(),
      }, { status: 400 });
    }
    
    if (body.publishedYear < 1000 || body.publishedYear > new Date().getFullYear()) {
      return NextResponse.json({
        success: false,
        error: 'Invalid publication year',
        timestamp: Date.now(),
      }, { status: 400 });
    }
    
    const newBook = await addBook(body);
    
    return NextResponse.json({
      success: true,
      data: newBook,
      message: 'Book added successfully',
      timestamp: Date.now(),
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/books error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add book',
      timestamp: Date.now(),
    }, { status: 500 });
  }
}
```

## 📄 **File 13: app/api/books/[id]/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getBook, updateBook, deleteBook } from '@/lib/books-data';
import { BookUpdateData } from '@/lib/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Book ID is required',
        timestamp: Date.now(),
      }, { status: 400 });
    }
    
    const book = await getBook(id);
    
    if (!book) {
      return NextResponse.json({
        success: false,
        error: 'Book not found',
        timestamp: Date.now(),
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: book,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error(`GET /api/books/${await context.params.id} error:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch book',
      timestamp: Date.now(),
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Book ID is required',
        timestamp: Date.now(),
      }, { status: 400 });
    }
    
    const body: BookUpdateData = await request.json();
    
    // Validate rating if provided
    if (body.rating !== undefined && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5',
        timestamp: Date.now(),
      }, { status: 400 });
    }
    
    // Validate year if provided
    const currentYear = new Date().getFullYear();
    if (body.publishedYear !== undefined && 
        (body.publishedYear < 1000 || body.publishedYear > currentYear)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid publication year',
        timestamp: Date.now(),
      }, { status: 400 });
    }
    
    const updatedBook = await updateBook(id, body);
    
    if (!updatedBook) {
      return NextResponse.json({
        success: false,
        error: 'Book not found',
        timestamp: Date.now(),
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: updatedBook,
      message: 'Book updated successfully',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error(`PUT /api/books/${await context.params.id} error:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update book',
      timestamp: Date.now(),
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Book ID is required',
        timestamp: Date.now(),
      }, { status: 400 });
    }
    
    const deleted = await deleteBook(id);
    
    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Book not found',
        timestamp: Date.now(),
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Book deleted successfully',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error(`DELETE /api/books/${await context.params.id} error:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete book',
      timestamp: Date.now(),
    }, { status: 500 });
  }
}
```

## 📄 **File 14: app/api/books/stats/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getStats } from '@/lib/books-data';

export async function GET(request: NextRequest) {
  try {
    const stats = await getStats();
    
    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('GET /api/books/stats error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch statistics',
      timestamp: Date.now(),
    }, { status: 500 });
  }
}
```

## 📄 **File 15: app/page.tsx**
```typescript
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import BookList from '@/components/BookList';
import { getBooks, getRecentBooks } from '@/lib/books-data';
import { ArrowRight, PlusCircle, BookOpen, Star, TrendingUp } from 'lucide-react';

export default async function HomePage() {
  const [allBooks, recentBooks] = await Promise.all([
    getBooks(),
    getRecentBooks(5),
  ]);

  const topRatedBooks = [...allBooks]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-primary-600">BookLib</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          A complete CRUD application for managing your book collection. Built with Next.js 14, TypeScript, and Tailwind CSS.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/books"
            className="btn-primary inline-flex items-center px-6 py-3 text-lg"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Browse All Books
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
          <Link
            href="/add-book"
            className="btn-secondary inline-flex items-center px-6 py-3 text-lg"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New Book
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Library Overview</h2>
        <StatsCard />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Recent Books */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recently Added</h2>
            <Link
              href="/books"
              className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentBooks.map((book) => (
              <div key={book.id} className="card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="ml-1 font-medium">{book.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                    {book.genre}
                  </span>
                  <Link
                    href={`/books/${book.id}`}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Rated Books */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Top Rated Books</h2>
            <TrendingUp className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {topRatedBooks.map((book, index) => (
              <div key={book.id} className="card p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center font-bold mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(book.rating)
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {book.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* All Books Preview */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Books</h2>
          <span className="text-gray-600">
            Showing {allBooks.length} books
          </span>
        </div>
        <BookList initialBooks={allBooks.slice(0, 6)} showFilters={false} />
        {allBooks.length > 6 && (
          <div className="text-center mt-6">
            <Link
              href="/books"
              className="btn-primary inline-flex items-center px-6 py-3"
            >
              View All Books ({allBooks.length})
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Full CRUD Operations</h3>
            <p className="text-gray-600">
              Create, Read, Update, and Delete books with a clean interface
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Advanced Filtering</h3>
            <p className="text-gray-600">
              Search, filter by genre, rating, and sort books easily
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Real-time Statistics</h3>
            <p className="text-gray-600">
              Track your library with detailed stats and analytics
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
```

## 📄 **File 16: app/books/page.tsx**
```typescript
import Link from 'next/link';
import BookList from '@/components/BookList';
import { getBooks } from '@/lib/books-data';
import { PlusCircle, BookOpen, Filter } from 'lucide-react';

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Library</h1>
            <p className="text-gray-600 mt-2">
              Manage your collection of {books.length} books
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/add-book"
              className="btn-primary inline-flex items-center"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Book
            </Link>
            <Link
              href="/books?sort=rating&order=desc"
              className="btn-secondary inline-flex items-center"
            >
              <Filter className="h-5 w-5 mr-2" />
              Top Rated
            </Link>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-4">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Books</span>
        </nav>
      </div>

      <BookList initialBooks={books} />
    </div>
  );
}
```

## 📄 **File 17: app/books/[id]/page.tsx**
```typescript
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBook } from '@/lib/books-data';
import { 
  ArrowLeft, 
  Calendar, 
  Star, 
  BookOpen, 
  User, 
  Hash, 
  Edit,
  Trash2 
} from 'lucide-react';

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  const handleDelete = async () => {
    'use server';
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Redirect to books page
        // This would be handled by a redirect in a real app
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/books"
          className="inline-flex items-center text-primary-600 hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Book Info */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {book.title}
                </h1>
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2" />
                  <span className="text-lg">{book.author}</span>
                </div>
              </div>
              
              <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="ml-2 text-xl font-bold text-yellow-700">
                  {book.rating.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="badge bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1">
                {book.genre}
              </span>
              {book.pages && (
                <span className="badge bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {book.pages} pages
                </span>
              )}
              <span className="badge bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {book.publishedYear}
              </span>
              {book.isbn && (
                <span className="badge bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 flex items-center">
                  <Hash className="h-4 w-4 mr-1" />
                  {book.isbn}
                </span>
              )}
            </div>

            <div className="prose max-w-none mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {book.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Added On</h4>
                <p className="text-gray-900">
                  {new Date(book.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Last Updated</h4>
                <p className="text-gray-900">
                  {new Date(book.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
              <Link
                href={`/books/${book.id}/edit`}
                className="btn-primary inline-flex items-center"
              >
                <Edit className="h-5 w-5 mr-2" />
                Edit Book
              </Link>
              <form action={handleDelete}>
                <button
                  type="submit"
                  onClick={(e) => {
                    if (!confirm('Are you sure you want to delete this book?')) {
                      e.preventDefault();
                    }
                  }}
                  className="btn-secondary inline-flex items-center text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Delete Book
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Book Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-600">Title</dt>
                <dd className="text-gray-900">{book.title}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Author</dt>
                <dd className="text-gray-900">{book.author}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Publication Year</dt>
                <dd className="text-gray-900">{book.publishedYear}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Genre</dt>
                <dd className="text-gray-900">{book.genre}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Rating</dt>
                <dd className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(book.rating)
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 font-medium">
                    {book.rating.toFixed(1)} / 5
                  </span>
                </dd>
              </div>
              {book.pages && (
                <div>
                  <dt className="text-sm text-gray-600">Pages</dt>
                  <dd className="text-gray-900">{book.pages.toLocaleString()}</dd>
                </div>
              )}
              {book.isbn && (
                <div>
                  <dt className="text-sm text-gray-600">ISBN</dt>
                  <dd className="text-gray-900 font-mono">{book.isbn}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/add-book"
                className="flex items-center justify-center w-full btn-primary py-2"
              >
                Add Another Book
              </Link>
              <Link
                href="/books"
                className="flex items-center justify-center w-full btn-secondary py-2"
              >
                Browse All Books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 📄 **File 18: app/books/[id]/edit/page.tsx**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BookForm from '@/components/BookForm';
import { Book, BookFormData } from '@/lib/types';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/books/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setBook(data.data);
      } else {
        setError(data.error || 'Book not found');
        setTimeout(() => {
          router.push('/books');
        }, 3000);
      }
    } catch (err) {
      setError('Failed to load book');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: BookFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push(`/books/${id}`);
        router.refresh();
      } else {
        setError(data.error || 'Failed to update book');
      }
    } catch (err) {
      setError('Failed to update book');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
            <span className="text-xl">!</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to books page...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            href={`/books/${id}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Book
          </Link>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Book</h1>
          <p className="text-gray-600 mt-2">
            Update the details of &quot;{book.title}&quot;
          </p>
        </div>
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-4">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/books" className="hover:text-primary-600">Books</Link>
          <span>/</span>
          <Link href={`/books/${id}`} className="hover:text-primary-600">
            {book.title.substring(0, 20)}...
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Edit</span>
        </nav>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="card p-6">
        <BookForm
          initialData={book}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitText="Update Book"
        />
      </div>
    </div>
  );
}
```

## 📄 **File 19: app/add-book/page.tsx**
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BookForm from '@/components/BookForm';
import { BookFormData } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddBookPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: BookFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push('/books');
        router.refresh();
      } else {
        setError(data.error || 'Failed to add book');
      }
    } catch (err) {
      setError('Failed to add book');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/books"
            className="inline-flex items-center text-primary-600 hover:text-primary-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Link>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details to add a new book to your library
          </p>
        </div>
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-4">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href="/books" className="hover:text-primary-600">Books</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Add Book</span>
        </nav>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="card p-6">
        <BookForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          submitText="Add Book"
        />
      </div>
    </div>
  );
}
```

## 📄 **File 20: tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 📄 **File 21: README.md**
```markdown
# 📚 Book Library CRUD Application

A complete CRUD (Create, Read, Update, Delete) application for managing books, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete books
- ✅ **TypeScript** - Type-safe code throughout the application
- ✅ **Tailwind CSS** - Modern, responsive UI with utility-first CSS
- ✅ **Next.js 14** - Using App Router, Server Components, and API Routes
- ✅ **Dynamic Routing** - Individual book pages and edit pages
- ✅ **RESTful API** - Full API endpoints for all operations
- ✅ **Advanced Filtering** - Search, filter by genre, rating, and more
- ✅ **Sorting** - Sort by title, author, year, rating, or genre
- ✅ **Statistics** - Real-time library statistics
- ✅ **Responsive Design** - Works on all device sizes
- ✅ **Loading States** - Smooth loading indicators
- ✅ **Error Handling** - Comprehensive error handling
- ✅ **Form Validation** - Client and server-side validation

## 🏗️ Architecture

```
book-crud-app/
├── app/                    # Next.js App Router pages
│   ├── api/               # API Routes
│   ├── books/             # Books pages with dynamic routing
│   ├── add-book/          # Add book page
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
├── lib/                   # Utility functions and types
└── public/               # Static assets
```

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React** - UI library
- **Lucide React** - Icons
- **UUID** - ID generation

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd book-crud-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 API Endpoints

- `GET /api/books` - Get all books (with optional filters)
- `GET /api/books/[id]` - Get a specific book
- `POST /api/books` - Add a new book
- `PUT /api/books/[id]` - Update a book
- `DELETE /api/books/[id]` - Delete a book
- `GET /api/books/stats` - Get library statistics

## 🎨 Features in Detail

### 1. Book Management
- Add new books with detailed information
- Edit existing books
- Delete books with confirmation
- View individual book details

### 2. Search & Filter
- Search by title, author, or description
- Filter by genre
- Filter by minimum rating
- Multiple sort options

### 3. Statistics
- Total books count
- Average rating
- Total pages
- Genre distribution
- Publication year analysis

### 4. Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly buttons
- Adaptive typography

## 📚 Learning Concepts Covered

1. **TypeScript**
   - Interfaces and types
   - Type safety
   - Generic types
   - Utility types

2. **Next.js 14**
   - App Router
   - Server Components
   - Client Components
   - API Routes
   - Dynamic routing
   - Data fetching

3. **React**
   - Hooks (useState, useEffect, useMemo, useCallback)
   - Component composition
   - Props and state management
   - Event handling

4. **Tailwind CSS**
   - Utility-first styling
   - Responsive design
   - Custom components
   - Animation and transitions

5. **CRUD Operations**
   - RESTful API design
   - HTTP methods
   - Data validation
   - Error handling

6. **Array Operations**
   - map() for rendering lists
   - filter() for search functionality
   - reduce() for statistics
   - sort() for ordering data

## 🔧 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📄 License

MIT
```

## 🚀 **How to Run the Application**

1. **Copy all files** to your project directory
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Open** `http://localhost:3000` in your browser

## 🎯 **What This Project Teaches**

1. **Complete CRUD workflow** from frontend to backend
2. **TypeScript integration** with React and Next.js
3. **Tailwind CSS** for modern, responsive design
4. **Next.js App Router** with dynamic routing
5. **API Routes** for backend functionality
6. **Array methods** (map, filter, reduce, sort) in real-world scenarios
7. **Component architecture** and reusability
8. **Form handling** and validation
9. **State management** with React hooks
10. **Error handling** and loading states
