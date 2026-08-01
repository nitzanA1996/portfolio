import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <section aria-labelledby="archive-heading">
        <h1
          id="archive-heading"
          className="max-w-4xl text-xl leading-tight font-bold tracking-tight text-archive-950 sm:text-3xl lg:text-[2rem]"
        >
          Welcome to My Book Archive, your personal book catalogue
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-archive-muted sm:text-base">
          Keep your collection organized and find the book you want to
          read next.
        </p>
      </section>
    </Layout>
  );
}

export default App;
