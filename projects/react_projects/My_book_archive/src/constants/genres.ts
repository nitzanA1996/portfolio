export const BOOK_GENRES = [
  'Mystery',
  'Fantasy',
  'Sci-Fi',
  'Biography',
  'Classics',
  'Children',
] as const;

export type BookGenre = (typeof BOOK_GENRES)[number];
