const apikey = "b7dd0caa";
let search = "Batman";
let year = 2010;
let movies = []; // array of IMDB ids. To use in the function moviesWithFullInfo()
let moviesWithDetail = [];

// function search movies and takes out the imdb ID.
async function movieDataSearch() {
  try {
    let response = await fetch(
      `http://www.omdbapi.com/?s=${search}&type=movie&plot=full&apikey=${apikey}`
    );
    if (!response.ok) {
      throw new Error(
        `Error i hämtning av API: ${response.status} ${response.statusText}`
      );
    }
    let data = await response.json();
    console.log(data);

    let mappedData = data.Search.map((item) => ({
      imdbId: item.imdbID,
    }));
    movies.push(...mappedData);
    moviesWithFullInfo();
  } catch (error) {
    console.error(error);
  }
}

// console.log(movies);

async function moviesWithFullInfo() {
  for (const movie of movies) {
    try {
      const id = movie.imdbId; // Correctly access the imdbId
      console.log("Fetching data for IMDb ID:", id); // Debugging log

      let response = await fetch(
        `http://www.omdbapi.com/?i=${id}&type=movie&plot=full&apikey=${apikey}`
      );
      if (!response.ok) {
        throw new Error(`Error ${response.statusText}`);
      }
      let data = await response.json();

      let detailData = {
        genre: data.Genre, // Extract genre
        title: data.Title, // Extract title
        actors: data.Actors,
        img: data.Poster,
        runtime: data.Runtime,
        year: data.Year,
        writer: data.Writer,
        imdb: data.imdbID,
      };

      moviesWithDetail.push(detailData);
      console.log("MOOOOVIES", moviesWithDetail);
    } catch (error) {
      console.error("Error fetching movie info:", error);
    }
  }
  listMovies(moviesWithDetail);
}

// Call the search function
movieDataSearch();

function listMovies(moviesWithDetail) {
  const uL = document.getElementsByClassName("movieList")[0];
  for (let i = 0; i < moviesWithDetail.length; i++) {
    const detailData = moviesWithDetail[i];
    const movieListItem = document.createElement("li");
    movieListItem.classList.add("listCard");
    movieListItem.innerHTML = `
        <img id="imgCard" src="${detailData.img}" alt="poster för ${detailData.title}">
        <p>${detailData.title}</p>
        <p>${detailData.actors}</p>
        <p>${detailData.runtime}</p>
        <p>${detailData.year}</p>
        <p>${detailData.writer}</p>
        <a href="https://www.imdb.com/title/${detailData.imdb}/" target="_blank"><button>Läs mer på imdb</button></a>
        `;
    console.log(detailData.title);

    uL.appendChild(movieListItem);
  }
}

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("search");
async function searchNewMovies() {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = searchInput.value;
    search = input;
    movies = []; // tömmer arrayen innan sökning.
    moviesWithDetail = []; // tömmer array
    let uL = document.getElementsByClassName("movieList")[0]; // klass för listan
    uL.innerHTML = ""; // Töm listan innan vi lägger till nya resultat
    movieDataSearch();
    console.log(input);
    searchInput.value = "";
  });
}
searchNewMovies();
// function listMovies(moviesWithDetail) {
//   const uL = document.getElementsByClassName("movieList")[0];
//   moviesWithDetail.forEach((detailData) => {
//     const movieListItem = document.createElement("li");
//     movieListItem.classList.add("listCard");
//     movieListItem.innerHTML = `
//         <img id="imgCard" src="${detailData.Poster}" alt="poster för ${detailData.Title}">
//         <p>${detailData.title}</p>
//         <p>${detailData.Actors}</p>
//         <p>${detailData.Runtime}</p>
//         <p>${detailData.Year}</p>
//         <p>${detailData.writer}</p>
//         <a href="https://www.imdb.com/title/${detailData.imdb}/"target="_blank"><button>Läs mer på imdb</button></a>
//         `;
//     console.log(detailData.title);

//     uL.appendChild(movieListItem);
//   });
// }
