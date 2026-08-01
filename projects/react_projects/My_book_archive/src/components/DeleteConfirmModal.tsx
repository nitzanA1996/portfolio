import { LuTrash2, LuTriangleAlert, LuX } from 'react-icons/lu';

import type { Book } from '../models/books';

interface DeleteConfirmModalProps {
  book: Book | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  book,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!book) {
    return null;
  }

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-archive-950/45 p-4 backdrop-blur-[2px]"
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
            <LuTriangleAlert aria-hidden="true" className="size-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close delete confirmation"
            className="grid size-9 place-items-center rounded-full text-archive-muted transition hover:bg-archive-100 hover:text-archive-900 focus:outline-none focus:ring-4 focus:ring-archive-100"
          >
            <LuX aria-hidden="true" className="size-5" />
          </button>
        </div>

        <h2
          id="delete-dialog-title"
          className="mt-4 text-xl font-bold text-archive-950"
        >
          Delete this book?
        </h2>
        <p
          id="delete-dialog-description"
          className="mt-2 text-sm leading-6 text-archive-muted"
        >
          <span className="font-semibold text-archive-900">
            {book.title}
          </span>{' '}
          will be permanently removed from your archive.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full border border-archive-200 px-6 text-sm font-semibold text-archive-800 transition hover:bg-archive-50 focus:outline-none focus:ring-4 focus:ring-archive-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-6 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-wait disabled:opacity-60"
          >
            <LuTrash2 aria-hidden="true" className="size-4" />
            {isDeleting ? 'Deleting...' : 'Delete Book'}
          </button>
        </div>
      </section>
    </div>
  );
}
