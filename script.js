const apikey = "b7dd0caa";
let search = "Lord of the rings";
let year = 2010;
let movies = []; // array of IMDB ids. To use in the function moviesWithFullInfo()

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

    // listMovies(movies);
  } catch (error) {
    console.error(error);
  }
  moviesWithFullInfo();
}

console.log(movies);

async function moviesWithFullInfo() {
  movies.forEach((movie) => {
    const id = movie.imdbID;
    console.log("dadawdawd", id); // Skriv ut varje imdbId
  });
  try {
    let response = await fetch(
      `http://www.omdbapi.com/?i=${movies.imdbID}&type=movie&plot=full&apikey=${apikey}`
    );
    if (!response.ok) {
      throw new Error(`Error ${response.statusText}`);
    }
    let data = await response.json();
    console.log(`Fullständiga Filmer ${data}`);
  } catch (error) {}
}
movieDataSearch();
// async function movieData() {
//   try {
//     let response = await fetch(
//       `http://www.omdbapi.com/?s=${search}&y=${year}&apikey=${apikey}`
//     );

//     if (!response.ok) {
//       throw new Error(
//         `Error i hämtning av API: ${response.status} ${response.statusText}`
//       );
//     }

//     let data = await response.json();
//     let mappedData = data.Search.map((item) => ({
//       poster: item.Poster,
//       title: item.Title,
//       year: item.Year,
//       imdbId: item.imdbID,
//     }));
//     movies.push(...mappedData);
//     // listMovies(movies);
//     // console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// }

// // movieData();

// function listMovies(movies) {
//   const uL = document.getElementsByClassName("movieList")[0];
//   movies.forEach((movieList) => {
//     const movieListItem = document.createElement("li");
//     movieListItem.classList.add("listCard");
//     movieListItem.innerHTML = `
//         <img id="imgCard" src="${movieList.poster}" alt="poster för ${movieList.title}">
//         <p>${movieList.title}</p>
//         <p>${movieList.year}</p>
//         <a href="https://www.imdb.com/title/${movieList.imdbId}/"target="_blank"><button>Mer info</button></a>
//         `;
//     uL.appendChild(movieListItem);
//   });
// }

// const searchForm = document.getElementById("searchForm");
// const searchInput = document.getElementById("search");

// searchForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const input = searchInput.value;
//   search = input;
//   // movieDataSearch();
//   uL.innerHTML = ""; // Töm listan innan vi lägger till nya resultat
//   console.log(input);
// });
