async function moviesWithFullInfo() {
  try {
    const fetchPromises = movies.map(async (movie) => {
      const id = movie.imdbId;
      const response = await fetch(
        `http://www.omdbapi.com/?i=${id}&type=movie&plot=full&apikey=${apikey}`
      );
      if (!response.ok) {
        throw new Error(`Error ${response.statusText}`);
      }
      const data = await response.json();
      return {
        genre: data.Genre,
        title: data.Title,
        actors: data.Actors,
        img: data.Poster,
        runtime: data.Runtime,
        year: data.Year,
        writer: data.Writer,
        imdb: data.imdbID,
      };
    });

    // Wait for all fetches to complete
    const detailedMovies = await Promise.all(fetchPromises);

    // Filter out duplicates (if any) before adding to moviesWithDetail
    moviesWithDetail = detailedMovies.filter(
      (movie, index, self) =>
        index === self.findIndex((m) => m.imdb === movie.imdb)
    );

    console.log("Movies with detailed info:", moviesWithDetail);

    // Call functions after fetching all data
    listMovies(moviesWithDetail); // Populate the movie list
    imdbNewWindow(); // Link IMDB buttons
    saveToLocalStorage(); // Save favorite buttons
    restoreFavoriteButtonState(); // Restore favorite buttons
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}
