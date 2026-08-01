import {
  LuBookOpen,
  LuHeart,
  LuPencil,
  LuTag,
  LuTrash2,
} from 'react-icons/lu';

import type { Book } from '../models/books';

interface BookCardProps {
  book: Book;
  isMutating: boolean;
  onToggleFavorite: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export default function BookCard({
  book,
  isMutating,
  onToggleFavorite,
  onEdit,
  onDelete,
}: BookCardProps) {
  return (
    <article className="relative grid h-full min-w-0 gap-3 rounded-xl border border-archive-100 bg-white p-3 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-[5.25rem_minmax(0,1fr)] md:grid-rows-[1fr_auto]">
      <button
        type="button"
        disabled={isMutating}
        onClick={() => onToggleFavorite(book)}
        aria-label={
          book.isFavorite
            ? `Remove ${book.title} from favorites`
            : `Add ${book.title} to favorites`
        }
        className={`absolute top-2.5 right-2.5 z-10 grid size-9 place-items-center rounded-full bg-white/95 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-archive-100 disabled:opacity-50 ${
          book.isFavorite
            ? 'text-archive-500'
            : 'text-archive-400 hover:text-archive-600'
        }`}
      >
        <LuHeart
          aria-hidden="true"
          className={`size-5 ${book.isFavorite ? 'fill-current' : ''}`}
        />
      </button>

      <div className="relative grid h-36 place-items-center overflow-hidden rounded-lg bg-archive-100 text-archive-400 md:row-span-2 md:h-full md:min-h-36">
        <LuBookOpen aria-hidden="true" className="size-9" />
        <img
          key={book.coverImage}
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          className="absolute inset-0 size-full object-cover"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div className="min-w-0 pr-7">
        <h3 className="truncate text-sm font-bold text-archive-950 sm:text-base">
          {book.title}
        </h3>
        <p className="mt-0.5 truncate text-xs font-medium text-archive-700 sm:text-sm">
          {book.author}
        </p>
        <p className="mt-2 line-clamp-3 text-xs leading-4 text-archive-muted">
          {book.description || 'No description available.'}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 md:col-start-2">
        <span
          aria-label={`Genre: ${book.genre}`}
          title={book.genre}
          className="inline-flex min-w-0 items-center gap-1 rounded-full bg-archive-100 px-2 py-1 text-[0.68rem] font-semibold text-archive-800"
        >
          <LuTag aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="hidden truncate lg:inline">{book.genre}</span>
        </span>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={isMutating}
            onClick={() => onEdit(book)}
            aria-label={`Edit ${book.title}`}
            className="grid size-8 place-items-center rounded-full text-archive-900 transition hover:bg-archive-100 hover:text-archive-600 focus:outline-none focus:ring-4 focus:ring-archive-100 disabled:opacity-40"
          >
            <LuPencil aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            disabled={isMutating}
            onClick={() => onDelete(book)}
            aria-label={`Delete ${book.title}`}
            className="grid size-8 place-items-center rounded-full text-archive-900 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:opacity-40"
          >
            <LuTrash2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
