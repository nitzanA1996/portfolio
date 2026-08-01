import axios from 'axios';

import type {
  Book,
  CreateBookRequest,
  EditBookRequest,
} from '../models/books';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

const BOOKS_ENDPOINT = '/myBooks';

export const getBooks = async (signal?: AbortSignal): Promise<Book[]> => {
  const response = await apiClient.get<Book[]>(BOOKS_ENDPOINT, {
    signal,
  });

  return response.data;
};

export const createBook = async (
  book: CreateBookRequest,
): Promise<Book> => {
  const response = await apiClient.post<Book>(BOOKS_ENDPOINT, book);

  return response.data;
};

export const editBook = async (
  id: Book['id'],
  book: EditBookRequest,
): Promise<Book> => {
  const response = await apiClient.put<Book>(
    `${BOOKS_ENDPOINT}/${id}`,
    book,
  );

  return response.data;
};

export const deleteBook = async (id: Book['id']): Promise<void> => {
  await apiClient.delete<void>(`${BOOKS_ENDPOINT}/${id}`);
};

export { apiClient };
