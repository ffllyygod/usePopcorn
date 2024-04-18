import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { Loader } from "./Loader";

export const MovieDetails = ({
  selectedId,
  setSelectedId,
  watched,
  setWatched,
}) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatched = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    setWatched([...watched, newWatched]);
    setSelectedId(null);
  }

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  useEffect(() => {
    const asyncFn = async function () {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&i=${selectedId}`
      );
      if (!res.ok) throw new Error("Something went wrong!!");
      const data = await res.json();
      if (data.Response === "False") throw new Error("Movie not found");
      setMovie(data);
      setIsLoading(false);
    };
    asyncFn();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return function () {
      document.title = "usePopcorn";
    };
  }, [title]);

  useEffect(function () {
    const callback = (e) => {
      if (e.code === "Escape") {
        setSelectedId(null);
      }
    };
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, []);
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={() => setSelectedId(null)}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    // defaultRating={filterWatchedMovies.userRating}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  you have rated this movie {watchedUserRating} <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
};
