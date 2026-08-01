import type { Book } from '../models/books';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  isMutating: boolean;
  onToggleFavorite: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export default function BookGrid({
  books,
  isMutating,
  onToggleFavorite,
  onEdit,
  onDelete,
}: BookGridProps) {
  return (
    <section
      aria-label="Book collection"
      className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
    >
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isMutating={isMutating}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
