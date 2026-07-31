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
  timeout: 5000, // Set a timeout of 5 seconds for requests 
});

const BOOKS_ENDPOINT = '/myBooks';

export const getBooks = async (): Promise<Book[]> => {
  const response = await apiClient.get<Book[]>(BOOKS_ENDPOINT);

  return response.data;
};

export const createBook = async (
  book: CreateBookRequest,
): Promise<Book> => {
  const response = await apiClient.post<Book>(BOOKS_ENDPOINT, book);

  return response.data;
};

export const editBook = async (id: string, {...updates}: EditBookRequest): Promise<Book> => {
  const response = await apiClient.patch<Book>(
    `${BOOKS_ENDPOINT}/${id}`,
    updates,
  );

  return response.data;
};

export const deleteBook = async ( id: string): Promise<void> => {
  await apiClient.delete(`${BOOKS_ENDPOINT}/${id}`);
};

export { apiClient };
