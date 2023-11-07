const apiBaseUrl = "https://localhost:7220"; // API-bas-URL

// Ladda alla filmer
function loadMovies() {
  fetch(`${apiBaseUrl}/api/movie`)
    .then((response) => response.json())
    .then((movies) => {
      // Sortera filmer i bokstavsordning efter titel
      movies.sort((a, b) => a.title.localeCompare(b.title));
      displayMovies(movies);
    })
    .catch((error) => console.log("Error:", error));
}

function displayMovies(movies) {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = ""; // Rensa listan innan vi lägger till nya filmer

  movies.forEach((movie, index) => {
    movieList.innerHTML += `
      <div class="movie-item" id="movie-${index}">
        <h3 id="title-${index}">${movie.title} (${movie.year})</h3>
        <!-- Dölj detaljerna till en början -->
        <div id="details-${index}" class="movie-details" style="display: none;">
          <p>Genre: ${movie.genre}</p>
          <p>Rating: ${movie.rating}</p>
          <p>Director: ${movie.director}</p>
          <p>Duration: ${movie.duration} minutes</p>
          <button onclick='displayUpdateForm(${JSON.stringify(
            movie
          )})'>Edit</button>
          <button onclick='deleteMovie(${movie.id})'>Delete</button>
        </div>
      </div>
    `;
  });

  // Lägg till event listeners efter att alla filmer har lagts till i DOM
  movies.forEach((movie, index) => {
    document.getElementById(`title-${index}`).addEventListener("click", () => {
      toggleMovieDetails(index);
    });
  });
}

function toggleMovieDetails(index) {
  const details = document.getElementById(`details-${index}`);
  details.style.display = details.style.display === "none" ? "block" : "none";
}

// Skapa ny film
function createMovie() {
  const movieData = {
    title: document.getElementById("newMovieTitle").value,
    year: parseInt(document.getElementById("newMovieYear").value),
    genre: document.getElementById("newMovieGenre").value,
    rating: parseFloat(document.getElementById("newMovieRating").value),
    director: document.getElementById("newMovieDirector").value,
    duration: parseInt(document.getElementById("newMovieDuration").value),
  };

  fetch(`${apiBaseUrl}/api/movie`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Something went wrong on api server!");
    })
    .then((response) => {
      console.log(response);
      loadMovies(); // Ladda om filmlistan
      clearMovieForm(); // rensa formulären
    })
    .catch((error) => console.error("Error:", error));
}

// Visa uppdateringsformuläret med förifyllda data
function displayUpdateForm(movie) {
  document.getElementById("updateMovie").style.display = "block";
  document.getElementById("updateMovieId").value = movie.id;
  document.getElementById("updateMovieTitle").value = movie.title;
  document.getElementById("updateMovieYear").value = movie.year;
  document.getElementById("updateMovieGenre").value = movie.genre;
  document.getElementById("updateMovieRating").value = movie.rating;
  document.getElementById("updateMovieDirector").value = movie.director;
  document.getElementById("updateMovieDuration").value = movie.duration;
}

// Uppdatera en befintlig film
function updateMovie() {
  const movieId = document.getElementById("updateMovieId").value;
  const movieData = {
    id: movieId,
    title: document.getElementById("updateMovieTitle").value,
    year: parseInt(document.getElementById("updateMovieYear").value),
    genre: document.getElementById("updateMovieGenre").value,
    rating: parseFloat(document.getElementById("updateMovieRating").value),
    director: document.getElementById("updateMovieDirector").value,
    duration: parseInt(document.getElementById("updateMovieDuration").value),
  };

  fetch(`${apiBaseUrl}/api/movie/${movieId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movieData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Something went wrong on api server!");
    })
    .then(() => {
      document.getElementById("updateMovie").style.display = "none";
      loadMovies();
      clearMovieForm();
    })
    .catch((error) => console.error("Error:", error));
}

// Radera en film
function deleteMovie(movieId) {
  fetch(`${apiBaseUrl}/api/movie/${movieId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Something went wrong on api server!");
      }
      loadMovies();
    })
    .catch((error) => console.error("Error:", error));
}

// Funktion för att rensa formulär
function clearMovieForm() {
  document.getElementById("newMovieTitle").value = "";
  document.getElementById("newMovieYear").value = "";
  document.getElementById("newMovieGenre").value = "";
  document.getElementById("newMovieRating").value = "";
  document.getElementById("newMovieDirector").value = "";
  document.getElementById("newMovieDuration").value = "";
}

// Starta genom att ladda alla filmer när sidan laddas
document.addEventListener("DOMContentLoaded", loadMovies);
