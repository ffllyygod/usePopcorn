import { useEffect, useState } from "react";
// import { tempMovieData, tempWatchedData } from "./data.js";
import { Navbar } from "./components/Navbar.jsx";
// import { ToggleButton } from "./components/ToggleButton.jsx";
import { MovieList } from "./components/MovieList.jsx";
import { Summary } from "./components/Summary.jsx";
import { WatchedMovies } from "./components/WatchedMovies.jsx";
import { Box } from "./components/Box.jsx";
import { Loader } from "./components/Loader.jsx";
import Error from "./components/Error.jsx";
import { MovieDetails } from "./components/MovieDetails.jsx";

export default function App() {
  const [query, setQuery] = useState("matrix");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  // const [selectedId, setSelectedId] = useState("tt0133093");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const asyncFn = async function () {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&s=${query}`
        );
        if (!res.ok) throw new Error("Something went wrong!!");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
        console.log(data.Search);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    asyncFn();
  }, [query]);

  return (
    <>
      <Navbar query={query} setQuery={setQuery} movies={movies} />

      <main className="main">
        <Box isOpen={isOpen1} setIsOpen={setIsOpen1}>
          {/* {isLoading ? <Loader /> : {isError ? <Error message={error} /> : <MovieList movies={movies} />}} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
            />
          )}
          {error && <Error message={error} />}
        </Box>

        <Box isOpen={isOpen2} setIsOpen={setIsOpen2}>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              watched={watched}
              setWatched={setWatched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMovies watched={watched} />
            </>
          )}
        </Box>
      </main>
    </>
  );
}
