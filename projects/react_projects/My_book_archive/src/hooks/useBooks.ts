import { useCallback, useEffect, useState } from 'react';

import type {
  Book,
  CreateBookRequest,
  EditBookRequest,
} from '../models/books';
import {
  createBook as createBookRequest,
  deleteBook as deleteBookRequest,
  editBook as editBookRequest,
  getBooks,
} from '../services/api-services';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data: Book[] = await getBooks();
      setBooks(data);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // The effect intentionally synchronizes the hook with the remote API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchBooks();
  }, [fetchBooks]);

  const createBook = useCallback(
    async (book: CreateBookRequest): Promise<Book | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const createdBook = await createBookRequest(book);
        setBooks((currentBooks) => [...currentBooks, createdBook]);

        return createdBook;
      } catch (error: unknown) {
        setError(getErrorMessage(error));

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const editBook = useCallback(
    async (
      id: Book['id'],
      updates: EditBookRequest,
    ): Promise<Book | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const editedBook = await editBookRequest(id, updates);
        setBooks((currentBooks) =>
          currentBooks.map((book) =>
            book.id === id ? editedBook : book,
          ),
        );

        return editedBook;
      } catch (error: unknown) {
        setError(getErrorMessage(error));

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const deleteBook = useCallback(
    async (id: Book['id']): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await deleteBookRequest(id);
        setBooks((currentBooks) =>
          currentBooks.filter((book) => book.id !== id),
        );

        return true;
      } catch (error: unknown) {
        setError(getErrorMessage(error));

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    books,
    isLoading,
    error,
    fetchBooks,
    createBook,
    editBook,
    deleteBook,
    clearError,
  };
};
