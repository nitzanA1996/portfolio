import { LuHeart, LuPlus, LuSearch, LuX } from 'react-icons/lu';

interface BookControlsProps {
  searchTerm: string;
  showFavoritesOnly: boolean;
  onSearchChange: (value: string) => void;
  onToggleFavorites: () => void;
  onAddBook: () => void;
}

export default function BookControls({
  searchTerm,
  showFavoritesOnly,
  onSearchChange,
  onToggleFavorites,
  onAddBook,
}: BookControlsProps) {
  return (
    <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-lg">
        <LuSearch
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-archive-muted"
        />
        <label htmlFor="book-search" className="sr-only">
          Search books by title
        </label>
        <input
          id="book-search"
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by book title..."
          className="h-11 w-full rounded-full border border-archive-200 bg-white pr-11 pl-11 text-sm text-archive-950 shadow-sm outline-none transition placeholder:text-archive-muted/75 focus:border-archive-500 focus:ring-4 focus:ring-archive-100 sm:text-base"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-archive-muted transition hover:bg-archive-100 hover:text-archive-800 focus:outline-none focus:ring-4 focus:ring-archive-100"
          >
            <LuX aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>

      <div className="flex shrink-0 gap-3">
        <button
          type="button"
          aria-pressed={showFavoritesOnly}
          onClick={onToggleFavorites}
          className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-archive-100 sm:flex-none sm:text-base ${
            showFavoritesOnly
              ? 'border-archive-800 bg-archive-800 text-white shadow-md shadow-archive-800/20'
              : 'border-archive-200 bg-white text-archive-800 shadow-sm hover:border-archive-300 hover:bg-archive-50'
          }`}
        >
          <LuHeart
            aria-hidden="true"
            className={`size-5 ${showFavoritesOnly ? 'fill-current' : ''}`}
          />
          Favorites only
        </button>

        <button
          type="button"
          onClick={onAddBook}
          className="hidden h-11 items-center justify-center gap-2 rounded-full bg-archive-800 px-6 text-sm font-semibold text-white shadow-md shadow-archive-800/20 transition hover:bg-archive-700 focus:outline-none focus:ring-4 focus:ring-archive-200 sm:inline-flex sm:text-base"
        >
          <LuPlus aria-hidden="true" className="size-5" />
          Add New Book
        </button>
      </div>

      <button
        type="button"
        onClick={onAddBook}
        aria-label="Add new book"
        className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-archive-800 text-white shadow-xl shadow-archive-800/30 transition hover:bg-archive-700 focus:outline-none focus:ring-4 focus:ring-archive-200 sm:hidden"
      >
        <LuPlus aria-hidden="true" className="size-7" />
      </button>
    </div>
  );
}
