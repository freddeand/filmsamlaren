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
      }
    });
  });
}

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
