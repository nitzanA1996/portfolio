import type { IconType } from 'react-icons';
import {
  LuBaby,
  LuCastle,
  LuFeather,
  LuLibraryBig,
  LuRocket,
  LuSearch,
  LuUserRound,
} from 'react-icons/lu';

import {
  BOOK_GENRES,
  type BookGenre,
} from '../constants/genres';

interface GenreFiltersProps {
  selectedGenre: BookGenre | null;
  onGenreChange: (genre: BookGenre | null) => void;
}

const GENRE_ICONS: Record<BookGenre, IconType> = {
  Mystery: LuSearch,
  Fantasy: LuCastle,
  'Sci-Fi': LuRocket,
  Biography: LuUserRound,
  Classics: LuFeather,
  Children: LuBaby,
};

export default function GenreFilters({
  selectedGenre,
  onGenreChange,
}: GenreFiltersProps) {
  return (
    <section className="mt-7" aria-labelledby="genre-filter-heading">
      <h2
        id="genre-filter-heading"
        className="mb-3 text-base font-bold text-archive-950 sm:text-lg"
      >
        Genre Filters
      </h2>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-7 lg:gap-4 lg:overflow-visible lg:px-0">
        <GenreButton
          label="All"
          Icon={LuLibraryBig}
          isSelected={selectedGenre === null}
          onClick={() => onGenreChange(null)}
        />

        {BOOK_GENRES.map((genre) => (
          <GenreButton
            key={genre}
            label={genre}
            Icon={GENRE_ICONS[genre]}
            isSelected={selectedGenre === genre}
            onClick={() => onGenreChange(genre)}
          />
        ))}
      </div>
    </section>
  );
}

interface GenreButtonProps {
  label: string;
  Icon: IconType;
  isSelected: boolean;
  onClick: () => void;
}

function GenreButton({
  label,
  Icon,
  isSelected,
  onClick,
}: GenreButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`flex h-22 min-w-24 snap-start flex-col items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-archive-200 sm:h-24 sm:min-w-28 lg:w-full lg:min-w-0 ${
        isSelected
          ? 'border-archive-800 bg-linear-to-br from-archive-700 to-archive-900 text-white shadow-lg shadow-archive-800/20'
          : 'border-archive-100 bg-linear-to-br from-archive-100 to-archive-200/85 text-archive-950 hover:-translate-y-0.5 hover:border-archive-300 hover:shadow-md'
      }`}
    >
      <Icon aria-hidden="true" className="size-7 stroke-[1.6] sm:size-8" />
      <span>{label}</span>
    </button>
  );
}
