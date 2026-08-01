import { useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import BookControls from './components/BookControls';
import BookFormModal from './components/BookFormModal';
import BookGrid from './components/BookGrid';
import BooksStatus from './components/BooksStatus';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import GenreFilters from './components/GenreFilters';
import Layout from './components/Layout';
import type { BookGenre } from './constants/genres';
import { useBooks } from './hooks/useBooks';
import type { Book, CreateBookRequest } from './models/books';

function App() {
  const {
    books,
    isLoading,
    isMutating,
    error,
    fetchBooks,
    createBook,
    editBook,
    deleteBook,
    toggleFavorite,
  } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] =
    useState<BookGenre | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch = book.title
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesGenre =
        selectedGenre === null || book.genre === selectedGenre;
      const matchesFavorite =
        !showFavoritesOnly || book.isFavorite;

      return matchesSearch && matchesGenre && matchesFavorite;
    });
  }, [books, searchTerm, selectedGenre, showFavoritesOnly]);

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    selectedGenre !== null ||
    showFavoritesOnly;

  const openCreateForm = (): void => {
    setEditingBook(null);
    setIsBookFormOpen(true);
  };

  const openEditForm = (book: Book): void => {
    setEditingBook(book);
    setIsBookFormOpen(true);
  };

  const closeBookForm = (): void => {
    setIsBookFormOpen(false);
    setEditingBook(null);
  };

  const handleSaveBook = async (
    request: CreateBookRequest,
  ): Promise<void> => {
    const savedBook = editingBook
      ? await editBook(editingBook.id, request)
      : await createBook(request);

    if (savedBook) {
      toast.success(
        editingBook
          ? 'Book updated successfully.'
          : 'Book added to your archive.',
      );
      closeBookForm();
    } else {
      toast.error('The book could not be saved. Please try again.');
    }
  };

  const handleToggleFavorite = async (book: Book): Promise<void> => {
    const updatedBook = await toggleFavorite(book);

    if (updatedBook) {
      toast.info(
        updatedBook.isFavorite
          ? `${updatedBook.title} added to favorites.`
          : `${updatedBook.title} removed from favorites.`,
      );
    } else {
      toast.error('The favorite status could not be changed.');
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!bookToDelete) {
      return;
    }

    const deletedBookTitle = bookToDelete.title;
    const wasDeleted = await deleteBook(bookToDelete.id);

    if (wasDeleted) {
      setBookToDelete(null);
      toast.success(`${deletedBookTitle} was deleted.`);
    } else {
      toast.error('The book could not be deleted. Please try again.');
    }
  };

  return (
    <Layout>
      <section aria-labelledby="archive-heading">
        <h1
          id="archive-heading"
          className="max-w-4xl text-xl leading-tight font-bold tracking-tight text-archive-950 sm:text-3xl lg:text-[2rem]"
        >
          Welcome to My Book Archive, your personal book catalogue
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-archive-muted sm:text-base">
          Keep your collection organized and find the book you want to
          read next.
        </p>
      </section>

      <BookControls
        searchTerm={searchTerm}
        showFavoritesOnly={showFavoritesOnly}
        onSearchChange={setSearchTerm}
        onToggleFavorites={() =>
          setShowFavoritesOnly((currentValue) => !currentValue)
        }
        onAddBook={openCreateForm}
      />

      <GenreFilters
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
      />

      {!isLoading && !error && (
        <p className="mt-6 text-sm font-medium text-archive-muted">
          {filteredBooks.length}{' '}
          {filteredBooks.length === 1 ? 'book' : 'books'} found
        </p>
      )}

      <BooksStatus
        isLoading={isLoading}
        error={books.length === 0 ? error : null}
        isEmpty={!isLoading && filteredBooks.length === 0}
        hasActiveFilters={hasActiveFilters}
        onRetry={() => void fetchBooks()}
      />

      {!isLoading && filteredBooks.length > 0 && (
        <BookGrid
          books={filteredBooks}
          isMutating={isMutating}
          onToggleFavorite={(book) => void handleToggleFavorite(book)}
          onEdit={openEditForm}
          onDelete={setBookToDelete}
        />
      )}

      <BookFormModal
        isOpen={isBookFormOpen}
        book={editingBook}
        isSubmitting={isMutating}
        onClose={closeBookForm}
        onSubmit={handleSaveBook}
      />

      <DeleteConfirmModal
        book={bookToDelete}
        isDeleting={isMutating}
        onClose={() => setBookToDelete(null)}
        onConfirm={() => void handleConfirmDelete()}
      />

      <ToastContainer
        position="top-right"
        autoClose={2800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        limit={3}
      />
    </Layout>
  );
}

export default App;
