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

export default function App() {
  const [query, setQuery] = useState("matrix");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);

  useEffect(() => {
    const asyncFn = async function () {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&s=${query}`
      );
      const data = await res.json();
      setMovies(data.Search);
      setIsLoading(false);
    };
    asyncFn();
  }, [query]);

  return (
    <>
      <Navbar query={query} setQuery={setQuery} movies={movies} />

      <main className="main">
        <Box isOpen={isOpen1} setIsOpen={setIsOpen1}>
          {isLoading ? <Loader /> : <MovieList movies={movies} />}
        </Box>

        <Box isOpen={isOpen2} setIsOpen={setIsOpen2}>
          <>
            <Summary watched={watched} />
            <WatchedMovies watched={watched} />
          </>
        </Box>
      </main>
    </>
  );
}
