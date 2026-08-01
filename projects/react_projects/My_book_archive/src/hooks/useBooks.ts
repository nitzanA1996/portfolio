import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import type {
  Book,
  CreateBookRequest,
  EditBookChanges,
  EditBookRequest,
} from '../models/books';
import {
  createBook as createBookRequest,
  deleteBook as deleteBookRequest,
  editBook as editBookRequest,
  getBooks,
} from '../services/api-services';

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'The request took too long. Please try again.';
    }

    if (!error.response) {
      return 'Unable to connect to the server. Check your connection.';
    }

    return `The request failed with status ${error.response.status}.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async (signal?: AbortSignal): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getBooks(signal);
      setBooks(data);
    } catch (error: unknown) {
      if (!axios.isCancel(error)) {
        setError(getErrorMessage(error));
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    // The effect intentionally synchronizes the hook with the remote API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchBooks(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchBooks]);

  const createBook = useCallback(
    async (book: CreateBookRequest): Promise<Book | null> => {
      setIsMutating(true);
      setError(null);

      try {
        const createdBook = await createBookRequest(book);
        setBooks((currentBooks) => [...currentBooks, createdBook]);

        return createdBook;
      } catch (error: unknown) {
        setError(getErrorMessage(error));

        return null;
      } finally {
        setIsMutating(false);
      }
    },
    [],
  );

  const editBook = useCallback(
    async (
      id: Book['id'],
      updates: EditBookChanges,
    ): Promise<Book | null> => {
      setIsMutating(true);
      setError(null);

      try {
        const currentBook = books.find((book) => book.id === id);

        if (!currentBook) {
          throw new Error('The book could not be found in the archive.');
        }

        const request: EditBookRequest = {
          title: updates.title ?? currentBook.title,
          author: updates.author ?? currentBook.author,
          description: updates.description ?? currentBook.description,
          coverImage: updates.coverImage ?? currentBook.coverImage,
          isFavorite: updates.isFavorite ?? currentBook.isFavorite,
          genre: updates.genre ?? currentBook.genre,
        };

        const editedBook = await editBookRequest(id, request);
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
        setIsMutating(false);
      }
    },
    [books],
  );

  const deleteBook = useCallback(
    async (id: Book['id']): Promise<boolean> => {
      setIsMutating(true);
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
        setIsMutating(false);
      }
    },
    [],
  );

  const toggleFavorite = useCallback(
    async (book: Book): Promise<Book | null> =>
      editBook(book.id, { isFavorite: !book.isFavorite }),
    [editBook],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    books,
    isLoading,
    isMutating,
    error,
    fetchBooks,
    createBook,
    editBook,
    deleteBook,
    toggleFavorite,
    clearError,
  };
};
