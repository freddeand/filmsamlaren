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
      if (!moviesWithDetail.some((movie) => movie.imdb === detailData.imdb)) {
        moviesWithDetail.push(detailData);
      }
      // console.log("DETAILDATA", detailData);
      console.log("MOVIESWITHDETAIL", moviesWithDetail);
    } catch (error) {
      console.error("Error fetching movie info:", error);
    }
  }
  listMovies(moviesWithDetail); // Lägg till filmerna i listan
  imdbNewWindow(); // Koppla IMDB-knappar
  saveToLocalStorage(); // Aktivera spara-favoriter-knappar
  restoreFavoriteButtonState(); // Återställ favoritknappar
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

// Call the function on page load
document.addEventListener("DOMContentLoaded", () => {
  loadFavorites(); // Ladda favoritfilmer
  updateFavoriteButtonVisibility();
});

// Call function

searchNewMovies();
movieDataSearch();
