import { useMemo, useState } from 'react';

import BookControls from './components/BookControls';
import GenreFilters from './components/GenreFilters';
import Layout from './components/Layout';
import type { BookGenre } from './constants/genres';
import { useBooks } from './hooks/useBooks';

function App() {
  const { books, isLoading, error } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] =
    useState<BookGenre | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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
      />

      <GenreFilters
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
      />

      <p className="mt-6 text-sm font-medium text-archive-muted">
        {isLoading
          ? 'Loading your book collection...'
          : error
            ? error
            : `${filteredBooks.length} ${filteredBooks.length === 1 ? 'book' : 'books'} found`}
      </p>
    </Layout>
  );
}

export default App;
