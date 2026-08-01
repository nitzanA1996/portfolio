import { LuBookOpen } from 'react-icons/lu';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-archive-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:h-19 sm:px-6 lg:px-10">
        <div className="flex items-center gap-2.5 text-archive-900 sm:gap-3">
          <LuBookOpen
            aria-hidden="true"
            className="size-8 stroke-[1.7] sm:size-10"
          />
          <span className="text-lg font-bold tracking-tight sm:text-2xl">
            My Book Archive
          </span>
        </div>
      </div>
    </header>
  );
}
