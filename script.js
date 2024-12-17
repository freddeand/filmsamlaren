const apikey = "b7dd0caa";
let search = "action";
let year = 2010;
let movies = [];
async function movieDataSearch() {
  try {
    let response = await fetch(
      `http://www.omdbapi.com/?s=${search}&apikey=${apikey}`
    );
    if (!response.ok) {
      throw new Error(
        `Error i hämtning av API: ${response.status} ${response.statusText}`
      );
    }
    let data = await response.json();
    let mappedData = data.Search.map((item) => ({
      poster: item.Poster,
      title: item.Title,
      year: item.Year,
      imdbId: item.imdbID,
    }));
    movies.push(...mappedData);

    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

movieDataSearch();
console.log(movies);
async function movieData() {
  try {
    let response = await fetch(
      `http://www.omdbapi.com/?s=${search}&y=${year}&apikey=${apikey}`
    );

    if (!response.ok) {
      throw new Error(
        `Error i hämtning av API: ${response.status} ${response.statusText}`
      );
    }

    let data = await response.json();
    let mappedData = data.Search.map((item) => ({
      poster: item.Poster,
      title: item.Title,
      year: item.Year,
      imdbId: item.imdbID,
    }));
    movies.push(...mappedData);
    listMovies(movies);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

movieData();

function listMovies(movies) {
  const uL = document.getElementsByClassName("movieList")[0];
  movies.forEach((movieList) => {
    const movieListItem = document.createElement("li");
    movieListItem.classList.add("listCard");
    movieListItem.innerHTML = `
        <img id="imgCard" src="${movieList.poster}" alt="poster för ${movieList.title}">
        <p>${movieList.title}</p>
        <p>${movieList.year}</p>
        <a href="https://www.imdb.com/title/${movieList.imdbId}/"target="_blank"><button>Mer info</button></a>
        `;
    uL.appendChild(movieListItem);
  });
}
