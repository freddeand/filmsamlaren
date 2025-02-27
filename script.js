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
      switch (response.status) {
        case 400:
          throw new Error("HTTP_400");
        case 401:
          throw new Error("HTTP_401");
        case 404:
          throw new Error("HTTP_404");
        case 500:
          throw new Error("HTTP_500");
        default:
          throw new Error(`HTTP_${response.status}`);
      }
    }

    let dataForSearch = await response.json();
    console.log("Är detta resultatet?", dataForSearch.Response);

    if (dataForSearch.Response === "True") {
      displayDataOnPage(dataForSearch.totalResults, search); // Skicka både resultat och input

      let mappedData = dataForSearch.Search.map((item) => ({
        imdbId: item.imdbID,
      }));
      movies.push(...mappedData);
      moviesWithFullInfo();
    } else {
      throw new Error(`No results for query: ${search}`);
    }
  } catch (error) {
    console.error(error);
    let errorMessage = "";
    switch (error.message) {
      case "HTTP_400":
        errorMessage =
          "Error 400: Bad Request. Please check the API parameters.";
        break;
      case "HTTP_401":
        errorMessage = "Error 401: Unauthorized. Check your API key.";
        break;
      case "HTTP_404":
        errorMessage = "Error 404: Movie not found.";
        break;
      case "HTTP_500":
        errorMessage = "Error 500: Server error. Please try again later.";
        break;
      default:
        errorMessage = `Inga resultat hittades för ${search}. Försök söka efter något annat!`;
        break;
    }
    if (dataOutput) {
      dataOutput.textContent = errorMessage;
    }
  }
}

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

function listMovies(moviesWithDetail) {
  const uL = document.getElementsByClassName("movieList")[0];

  for (let i = 0; i < moviesWithDetail.length; i++) {
    const detailData = moviesWithDetail[i];
    const movieListItem = document.createElement("li");
    movieListItem.classList.add("listCard");
    movieListItem.innerHTML = `<div class="divList">
        <img id="imgCard" src="${detailData.img}" alt="poster för ${detailData.title}">
        <h3>${detailData.title}</h3>
        
       <button class="imdbBtn">Mer info</button>
       <button class="favoritBtn">Lägg till i Favoriter</button>
        </div>`;
    // console.log(detailData.title);

    uL.appendChild(movieListItem);
  }
}
// <p>Actors :${detailData.actors}</p>
// <p>Runtime :${detailData.runtime}</p>
// <p>Release year :${detailData.year}</p>
// <p>Writers :${detailData.writer}</p>

function imdbNewWindow() {
  const imdbBtn = document.querySelectorAll(".imdbBtn");

  imdbBtn.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const movie = moviesWithDetail[index];
      if (movie) {
        showModal(movie);
      } else {
        console.error("Movie details not found for button index:", index);
        console.error("IMDB ID not found for button index:", index);
      }
    });
  });
}
// saveToLocalStorage function
function saveToLocalStorage() {
  const favBtn = document.querySelectorAll(".favoritBtn");

  favBtn.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const detailData = moviesWithDetail[index];

      if (detailData) {
        // Retrieve the current favorites from localStorage
        let favoriteMovies =
          JSON.parse(localStorage.getItem("favoriteMovies")) || [];

        // Check if the movie is already in the array to prevent duplicates
        if (!favoriteMovies.some((movie) => movie.imdb === detailData.imdb)) {
          favoriteMovies.push(detailData);

          // Save the updated array back to localStorage
          localStorage.setItem(
            "favoriteMovies",
            JSON.stringify(favoriteMovies)
          );

          console.log(`Saved movie "${detailData.title}" to favorites.`);

          // Update the UI with the new favorite
          addFavoriteMovie(detailData);

          // Save the button's state as disabled in localStorage
          let favoriteButtonsState =
            JSON.parse(localStorage.getItem("favoriteButtonsState")) || [];
          favoriteButtonsState.push({
            imdbId: detailData.imdb,
            state: "Tillagd i favoriter!",
          });
          localStorage.setItem(
            "favoriteButtonsState",
            JSON.stringify(favoriteButtonsState)
          );

          // Disable the specific button and change its text content
          button.disabled = true;
          button.textContent = "Tillagd i favoriter!";
          button.style.backgroundColor = "#7bdcb5";

          updateFavoriteButtonVisibility();
        } else {
          console.log("This movie is already in favorites!");
        }
      }
    });
  });
}

// restoreFavoriteButtonState function
function restoreFavoriteButtonState() {
  const favBtn = document.querySelectorAll(".favoritBtn");
  // läser tillståndet från localstorage
  const favoriteButtonsState =
    JSON.parse(localStorage.getItem("favoriteButtonsState")) || [];
  // uppdaterar varje knapp baserat på sparat tillstånd.
  favBtn.forEach((button, index) => {
    const imdbId = moviesWithDetail[index]?.imdb;
    const favoriteState = favoriteButtonsState.find(
      (item) => item.imdbId === imdbId
    );

    // If the movie is found in the favorite state, set the button text to "Tillagd!" and disable it
    if (favoriteState) {
      button.textContent = favoriteState.state; // Set the button text to "Tillagd!"
      button.disabled = true; // Disable the button
      button.style.backgroundColor = "#7bdcb5";
    }
  });
}

// Call the restore function on page load

function addFavoriteMovie(detailData) {
  const favBox = document.querySelector(".favoriteMovie");
  const favMovieCard = document.createElement("div");
  favMovieCard.classList.add("favorite-card");

  favMovieCard.innerHTML = `
    <p>${detailData.title}</p>
    <button class="remove-fav-btn">Ta bort</button>
  `;

  favBox.appendChild(favMovieCard);

  // Add functionality to the "Ta bort" button
  const removeButton = favMovieCard.querySelector(".remove-fav-btn");
  removeButton.addEventListener("click", () => {
    favBox.removeChild(favMovieCard); // Remove the card from the container
    removeFavorite(detailData.imdb); // Remove from localStorage
    const favBtn = document.querySelectorAll(".favoritBtn");
    favBtn.forEach((button, index) => {
      const movie = moviesWithDetail[index];
      if (movie && movie.imdb === detailData.imdb) {
        button.disabled = false;
        button.textContent = "Lägg till i Favoriter";
        button.style.backgroundColor = "#fcb900";
      }
    });

    console.log(`${detailData.title} has been removed from favorites.`);
  });
}

function removeFavorite(imdbId) {
  // tar bort filmerna från favoriter.
  let favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  favoriteMovies = favoriteMovies.filter((movie) => movie.imdb !== imdbId);
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
  // Ta bort knapptillståndet från favoriteButtonsState
  let favoriteButtonsState =
    JSON.parse(localStorage.getItem("favoriteButtonsState")) || [];
  favoriteButtonsState = favoriteButtonsState.filter(
    (item) => item.imdbId !== imdbId
  );
  localStorage.setItem(
    "favoriteButtonsState",
    JSON.stringify(favoriteButtonsState)
  );

  console.log(`Removed movie with IMDb ID ${imdbId} from favorites.`);
  updateFavoriteButtonVisibility();
}
function loadFavorites() {
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  favoriteMovies.forEach((movie) => {
    addFavoriteMovie(movie); // Add each favorite movie to the UI
  });
  updateFavoriteButtonVisibility();
}

function displayDataOnPage(data, input) {
  const dataOutput = document.getElementById("dataOutput");

  if (data === undefined) {
    dataOutput.textContent = `Inga resultat hittades för ${input}. Försök söka efter något annat!`;
  } else {
    dataOutput.textContent = `Hittade ${data} filmer för ${input}, visar upp några förslag här nere =) `;
  }
}

const favoriteButton = document.querySelector(".favoriteContainerBtn");
const favoriteMovie = document.querySelector(".favoriteMovie");
// Function to check if there are movies in localStorage
function hasFavoriteMovies() {
  const favoriteMovies =
    JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  return favoriteMovies.length > 0;
}

// Function to update the visibility of the favoriteButton
function updateFavoriteButtonVisibility() {
  if (hasFavoriteMovies()) {
    favoriteButton.style.display = "block";
  } else {
    favoriteButton.style.display = "none";
  }
}

// Toggle the visibility of the favoriteMovie container when the button is clicked
favoriteButton.addEventListener("click", () => {
  // Check if there are movies in localStorage before toggling
  console.log(favoriteButton);
  if (hasFavoriteMovies()) {
    if (
      favoriteMovie.style.display === "none" ||
      favoriteMovie.style.display === ""
    ) {
      favoriteMovie.style.display = "block"; // Show the element
    } else {
      favoriteMovie.style.display = "none"; // Hide the element
    }
  } else {
    console.log("inga favoriter.");
  }
});
function showModal(movie) {
  const modal = document.getElementById("imdbModal");
  const modalContent = document.getElementById("modalMovieContent");
  const closeModal = document.querySelector(".close");

  // Populate modal content
  modalContent.innerHTML = `
    <img src="${movie.img}" alt="Poster for ${movie.title}" style="width: 200px; height: auto; margin-bottom: 10px;">
    <h2>${movie.title}</h2>
    <p><strong>Actors:</strong> ${movie.actors}</p>
    <p><strong>Runtime:</strong> ${movie.runtime}</p>
    <p><strong>Release Year:</strong> ${movie.year}</p>
    <p><strong>Genre:</strong> ${movie.genre}</p>
    <p><strong>Writers:</strong> ${movie.writer}</p>
    <p><strong>Klicka här för att komma vidare till IMDB:</strong> <a href="https://www.imdb.com/title/${movie.imdb}" target="_blank">IMDB</a></p>
  `;

  // Show the modal
  modal.style.display = "block";

  // Add close functionality
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside the modal content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}
// Call the function on page load
document.addEventListener("DOMContentLoaded", () => {
  loadFavorites(); // Ladda favoritfilmer
  updateFavoriteButtonVisibility();
});

// Call function

moviesWithFullInfo();
movieDataSearch();
