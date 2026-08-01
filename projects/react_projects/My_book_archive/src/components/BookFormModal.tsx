import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { LuBookOpen, LuX } from 'react-icons/lu';

import {
  BOOK_GENRES,
  type BookGenre,
} from '../constants/genres';
import type { Book, CreateBookRequest } from '../models/books';

interface BookFormValues {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genre: BookGenre | '';
  isFavorite: boolean;
}

interface BookFormModalProps {
  isOpen: boolean;
  book: Book | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (book: CreateBookRequest) => Promise<void>;
}

const getDefaultValues = (book: Book | null): BookFormValues => ({
  title: book?.title ?? '',
  author: book?.author ?? '',
  description: book?.description ?? '',
  coverImage: book?.coverImage ?? '',
  genre: book?.genre ?? '',
  isFavorite: book?.isFavorite ?? false,
});

const isValidWebUrl = (value: string): boolean => {
  if (!value.trim()) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function BookFormModal({
  isOpen,
  book,
  isSubmitting,
  onClose,
  onSubmit,
}: BookFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormValues>({
    defaultValues: getDefaultValues(book),
  });

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(book));
    }
  }, [book, isOpen, reset]);

  if (!isOpen) {
    return null;
  }

  const submitForm = async (values: BookFormValues): Promise<void> => {
    const request: CreateBookRequest = {
      title: values.title.trim(),
      author: values.author.trim(),
      description: values.description.trim(),
      coverImage: values.coverImage.trim(),
      isFavorite: values.isFavorite,
      ...(values.genre ? { genre: values.genre } : {}),
    };

    await onSubmit(request);
  };

  const modalTitle = book ? 'Edit Book' : 'Add New Book';

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-archive-950/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-form-title"
        className="max-h-[94dvh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-archive-100 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5 text-archive-950">
            <LuBookOpen aria-hidden="true" className="size-6" />
            <h2 id="book-form-title" className="text-xl font-bold">
              {modalTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close book form"
            className="grid size-9 place-items-center rounded-full text-archive-muted transition hover:bg-archive-100 hover:text-archive-900 focus:outline-none focus:ring-4 focus:ring-archive-100"
          >
            <LuX aria-hidden="true" className="size-5" />
          </button>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(submitForm)}
          className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6 sm:py-6"
        >
          <FormField
            label="Title"
            error={errors.title?.message}
            required
          >
            <input
              {...register('title', {
                validate: (value) =>
                  value.trim().length > 0 || 'Title is required.',
                maxLength: {
                  value: 100,
                  message: 'Title must be 100 characters or fewer.',
                },
              })}
              type="text"
              autoComplete="off"
              className={getInputClassName(Boolean(errors.title))}
            />
          </FormField>

          <FormField
            label="Author"
            error={errors.author?.message}
            required
          >
            <input
              {...register('author', {
                validate: (value) =>
                  value.trim().length > 0 || 'Author is required.',
                maxLength: {
                  value: 80,
                  message: 'Author must be 80 characters or fewer.',
                },
              })}
              type="text"
              autoComplete="off"
              className={getInputClassName(Boolean(errors.author))}
            />
          </FormField>

          <FormField
            label="Cover image URL"
            error={errors.coverImage?.message}
          >
            <input
              {...register('coverImage', {
                validate: (value) =>
                  isValidWebUrl(value) ||
                  'Enter a valid HTTP or HTTPS URL.',
              })}
              type="url"
              placeholder="https://example.com/cover.jpg"
              className={getInputClassName(Boolean(errors.coverImage))}
            />
          </FormField>

          <FormField label="Genre" error={errors.genre?.message}>
            <select
              {...register('genre')}
              className={getInputClassName(Boolean(errors.genre))}
            >
              <option value="">Choose a genre (optional)</option>
              {BOOK_GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </FormField>

          <div className="sm:col-span-2">
            <FormField
              label="Description"
              error={errors.description?.message}
            >
              <textarea
                {...register('description', {
                  maxLength: {
                    value: 500,
                    message:
                      'Description must be 500 characters or fewer.',
                  },
                })}
                rows={4}
                className={`${getInputClassName(Boolean(errors.description))} resize-y`}
              />
            </FormField>
          </div>

          <label className="flex items-center gap-3 text-sm font-semibold text-archive-900 sm:col-span-2">
            <input
              {...register('isFavorite')}
              type="checkbox"
              className="size-4 rounded border-archive-300 text-archive-700 focus:ring-archive-300"
            />
            Add this book to favorites
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-archive-100 pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-full border border-archive-200 px-6 text-sm font-semibold text-archive-800 transition hover:bg-archive-50 focus:outline-none focus:ring-4 focus:ring-archive-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-full bg-archive-800 px-7 text-sm font-semibold text-white shadow-md shadow-archive-800/20 transition hover:bg-archive-700 focus:outline-none focus:ring-4 focus:ring-archive-200 disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : book ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <label className="block text-sm font-semibold text-archive-900">
      <span>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      <span className="mt-1.5 block">{children}</span>
      {error && (
        <span className="mt-1.5 block text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

const getInputClassName = (hasError: boolean): string =>
  `min-h-11 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-archive-950 outline-none transition placeholder:text-archive-muted/65 focus:ring-4 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-archive-200 focus:border-archive-500 focus:ring-archive-100'
  }`;
