const apikey = "b7dd0caa";
let search = "Batman";
let movies = []; // array of IMDB ids.
let moviesWithDetail = []; // detaljerade filmer

// Funktion för att hantera olika meddelanden
function displayMessage({ type, message, count }) {
  const searchContainer = document.querySelector(".search-container");
  const resultMessage = document.getElementById("resultMessage");
  const dataOutput = document.getElementById("dataOutput");

  // Rensa tidigare meddelanden
  if (resultMessage) resultMessage.textContent = "";
  if (dataOutput) dataOutput.textContent = "";
  const existingError = document.getElementById("error-message");
  if (existingError) existingError.remove();

  if (type === "error") {
    const errorElement = document.createElement("p");
    errorElement.id = "error-message";
    errorElement.textContent = message;
    errorElement.style.color = "red";
    errorElement.style.marginTop = "10px";
    searchContainer.appendChild(errorElement);
  } else if (type === "result") {
    resultMessage.textContent =
      count === 0
        ? "Inga resultat hittades. Försök med ett annat sökord."
        : `Visar upp ${count} filmer på websidan =).`;
  } else if (type === "data") {
    dataOutput.textContent = `Hittade totalt ${message} filmer i cyberrymden`;
  }
}

// Funktion för att söka efter filmer
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
    console.log("Sökresultat:", dataForSearch);

    if (dataForSearch.Response === "False") {
      displayMessage({
        type: "error",
        message: "Ingen film hittades med det namnet. Försök igen.",
      });
      return;
    }

    displayMessage({ type: "data", message: dataForSearch.totalResults });

    let mappedData = dataForSearch.Search.map((item) => ({
      imdbId: item.imdbID,
    }));
    movies.push(...mappedData);
    moviesWithFullInfo();
  } catch (error) {
    console.error("API Error:", error);
    displayMessage({
      type: "error",
      message: "Ett fel inträffade vid sökningen. Försök igen senare.",
    });
  }
}

// Hämta detaljerad information för varje film
async function moviesWithFullInfo() {
  for (const movie of movies) {
    try {
      let response = await fetch(
        `http://www.omdbapi.com/?i=${movie.imdbId}&type=movie&plot=full&apikey=${apikey}`
      );
      if (!response.ok) {
        throw new Error(`Error ${response.statusText}`);
      }
      let data = await response.json();

      let detailData = {
        genre: data.Genre,
        title: data.Title,
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
  listMovies(moviesWithDetail);
}

// Visa filmer i en lista
function listMovies(moviesWithDetail) {
  const uL = document.getElementsByClassName("movieList")[0];
  displayMessage({ type: "result", count: moviesWithDetail.length });
  for (let detailData of moviesWithDetail) {
    const movieListItem = document.createElement("li");
    movieListItem.classList.add("listCard");
    movieListItem.innerHTML = `<div class="divList">
        <img id="imgCard" src="${detailData.img}" alt="poster för ${detailData.title}">
        <p>${detailData.title}</p>
        <p>Actors: ${detailData.actors}</p>
        <p>Runtime: ${detailData.runtime}</p>
        <p>Release year: ${detailData.year}</p>
        <p>Writers: ${detailData.writer}</p>
        <a href="https://www.imdb.com/title/${detailData.imdb}/" target="_blank"><button class="imdbBtn">Läs mer på IMDb</button></a>
        <button class="favoritBtn">Favorit</button>
      </div>`;
    uL.appendChild(movieListItem);
  }
}

// Hantera ny sökning
function setupSearchListener() {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("search");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    search = searchInput.value.trim().toLowerCase();
    movies = [];
    moviesWithDetail = [];
    const uL = document.getElementsByClassName("movieList")[0];
    uL.innerHTML = "";
    movieDataSearch();
    searchInput.value = "";
  });
}

// Initiera sökningen
setupSearchListener();
movieDataSearch();
