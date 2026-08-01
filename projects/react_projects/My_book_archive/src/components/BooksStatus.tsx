import { LuBookOpen, LuRefreshCw, LuSearchX } from 'react-icons/lu';
import { ClipLoader } from 'react-spinners';

interface BooksStatusProps {
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  hasActiveFilters: boolean;
  onRetry: () => void;
}

export default function BooksStatus({
  isLoading,
  error,
  isEmpty,
  hasActiveFilters,
  onRetry,
}: BooksStatusProps) {
  if (isLoading) {
    return (
      <div className="grid min-h-56 place-items-center text-center">
        <div>
          <ClipLoader color="#6743a4" size={42} />
          <p className="mt-3 text-sm font-medium text-archive-muted">
            Loading your book collection...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-5 py-8 text-center">
        <p className="font-semibold text-red-800">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-archive-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-archive-700 focus:outline-none focus:ring-4 focus:ring-archive-200"
        >
          <LuRefreshCw aria-hidden="true" className="size-4" />
          Try again
        </button>
      </div>
    );
  }

  if (isEmpty) {
    const EmptyIcon = hasActiveFilters ? LuSearchX : LuBookOpen;

    return (
      <div className="grid min-h-56 place-items-center rounded-xl border border-dashed border-archive-200 bg-archive-50/70 px-5 text-center">
        <div>
          <EmptyIcon
            aria-hidden="true"
            className="mx-auto size-10 text-archive-500"
          />
          <h3 className="mt-3 font-bold text-archive-950">
            {hasActiveFilters ? 'No matching books' : 'Your archive is empty'}
          </h3>
          <p className="mt-1 text-sm text-archive-muted">
            {hasActiveFilters
              ? 'Try changing your search or filters.'
              : 'Add your first book to start the collection.'}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
