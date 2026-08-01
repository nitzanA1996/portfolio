import type { BookGenre } from '../constants/genres';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  isFavorite: boolean;
  genre: BookGenre;
}

type BookDetails = Omit<Book, 'id'>;

export type CreateBookRequest = Pick<BookDetails, 'title' | 'author'> &
  Partial<Omit<BookDetails, 'title' | 'author'>>;

export type EditBookRequest = Partial<Omit<Book, 'id'>>;
