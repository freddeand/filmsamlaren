const apikey = "b7dd0caa";
let search = "Harry potter";

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
    let dataForSearch = await response.json();
    console.log("Är detta resultatet?", dataForSearch.Response);

    displayDataOnPage(dataForSearch.totalResults, search); // Skicka både resultat och input
    if (dataForSearch.Response === "False") {
      displayErrorMessage("Ingen film hittades med det namnet. Försök igen.");
      return;
    }

    let mappedData = dataForSearch.Search.map((item) => ({
      imdbId: item.imdbID,
    }));
    movies.push(...mappedData);
    moviesWithFullInfo();
  } catch (error) {
    console.error(error);
    displayErrorMessage(
      "Ett fel inträffade vid sökningen. Försök igen senare."
    );
  }
}

// console.log(movies);

async function moviesWithFullInfo() {
  for (const movie of movies) {
    try {
      const id = movie.imdbId; // Correctly access the imdbId

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
    } catch (error) {
      console.error("Error fetching movie info:", error);
    }
  }

  // Uppdatera efter alla filmer har hämtats
  listMovies(moviesWithDetail);
}

function listMovies(moviesWithDetail) {
  const uL = document.getElementsByClassName("movieList")[0];

  for (let i = 0; i < moviesWithDetail.length; i++) {
    const detailData = moviesWithDetail[i];
    const movieListItem = document.createElement("li");
    movieListItem.classList.add("listCard");
    movieListItem.innerHTML = `<div class="divList">
        <img id="imgCard" src="${detailData.img}" alt="poster för ${detailData.title}">
        <h3>${detailData.title}</h3>
        <p>Actors :${detailData.actors}</p>
        <p>Runtime :${detailData.runtime}</p>
        <p>Release year :${detailData.year}</p>
        <p>Writers :${detailData.writer}</p>
       <button class="imdbBtn">Läs mer på imdb</button>
       <button class="favoritBtn">Favorit</button>
        </div>`;
    // console.log(detailData.title);

    uL.appendChild(movieListItem);
  }
}

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("search");
async function searchNewMovies() {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = searchInput.value.trim().toLowerCase();
    search = input;
    movies = []; // tömmer arrayen innan sökning.
    moviesWithDetail = []; // tömmer array
    console.log("222", moviesWithDetail.length);
    let uL = document.getElementsByClassName("movieList")[0]; // klass för listan
    uL.innerHTML = ""; // Töm listan innan vi lägger till nya resultat
    const errorMessage = document.getElementById("error-message");
    if (errorMessage) {
      errorMessage.remove(); // Rensa tidigare felmeddelande
    }
    movieDataSearch();
    console.log("Du skrev in", input);

    searchInput.value = "";
  });
}

function displayErrorMessage(message) {
  const searchContainer = document.querySelector(".search-container");
  const errorElement = document.createElement("p");
  errorElement.id = "error-message";
  errorElement.textContent = message;
  errorElement.style.color = "red";
  errorElement.style.marginTop = "10px";
  searchContainer.appendChild(errorElement);
}

function displayDataOnPage(data, input) {
  const dataOutput = document.getElementById("dataOutput");

  if (data === undefined) {
    dataOutput.textContent = `Inga resultat hittades för ${input}. Försök söka efter något annat!`;
  } else {
    dataOutput.textContent = `Hittade ${data} filmer för ${input} i cyberrymden, visar upp några förslag här nere =) `;
  }
}
// Call the search function

searchNewMovies();
movieDataSearch();
