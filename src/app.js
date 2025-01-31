import { baseUrl, apiToken, imageUrl } from "./config.js";

const nowPlayingEndpoint = `${baseUrl}/movie/now_playing`;
const searchMovieEndpoint = (query) => `${baseUrl}/search/movie?query=${query}`;
const movieDetailEndpoint = (movieId) => `${baseUrl}/movie/movie_id=${movieId}`;
const fetchOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiToken}`,
  },
};
const contentElm = document.querySelector("#content");
const app = () => {
  const displayLoading = (state) => {
    if (state) {
      contentElm.innerHTML = `
      <div class="text-center">
        <div class="spinner-border text-center" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
      </div>
        `;
    }
  };
  const displayMovies = (movies) => {
    let moviesTemplate = `
        <div class="row row-cols-1 row-cols-md-3 g-2 g-4">
        `;
    if (movies.length < 1) {
      displayAlert("Data tidak ditemukan");
      return false;
    }
    movies.forEach((movie) => {
      const { id, original_title, overview, poster_path } = movie;
      moviesTemplate += `
            <div class="col-lg-4 col-md-6 col-sm-12">
            <div class="card h-100">
              <img src="${imageUrl}${poster_path}" class="card-img-top" alt="..." />
              <div class="card-body">
                <h5 class="card-title">${original_title}</h5>
                <p class="card-text truncate">
                  ${overview}
                </p>
                <a href="#" data-id="${id}" class="card-link">Detail</a>
              </div>
            </div>
          </div>
            `;
    });
    moviesTemplate += `</div>`;
    contentElm.innerHTML = moviesTemplate;
  };
  const getNowPlayingList = () => {
    displayLoading(true);
    fetch(nowPlayingEndpoint, fetchOptions)
      .then((response) => response.json())
      .then((responseJson) => displayMovies(responseJson.results))
      .catch((error) => console.error(error));
  };

  const displayAlert = (message) => {
    contentElm.innerHTML = `<div class="alert alert-warning" role="alert">
    ${message}
  </div>`;
  };
  const searchBtn = document.querySelector("#btnSearch");
  const searchText = document.querySelector("#searchInput");
  searchText.addEventListener("input", function (event) {
    if (this.value.length < 1) getNowPlayingList();
  });

  searchText.addEventListener("keydown", function (event) {
    if (this.value.length > 0 && (event.key === "Enter" || event.keyCode === 13)) {
      event.preventDefault();
      searchMovies();
    }
  });

  searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    if (searchText.value.length > 1) searchMovies();
  });
  const searchMovies = async () => {
    displayLoading(true);
    try {
      const movieList = await fetch(searchMovieEndpoint(searchText.value), fetchOptions);
      const responseJson = await movieList.json();
      displayMovies(responseJson.results);
      console.log(responseJson.results);
    } catch (error) {
      console.log(error);
      displayAlert("Terjadi error saat mengambil data");
    }
  };
  //ini baru
  const movieDetailEndpoint = (movieId) => `${baseUrl}/movie/${movieId}`;

  const displayMovieDetail = (movie) => {
    const { original_title, overview, poster_path, release_date, vote_average, genres } = movie;

    contentElm.innerHTML = `
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <img src="${imageUrl}${poster_path}" class="img-fluid" alt="${original_title}">
        </div>
        <div class="col-md-8">
          <h2>${original_title}</h2>
          <p><strong>Release Date:</strong> ${release_date}</p>
          <p><strong>Rating:</strong> ${vote_average}</p>
          <p><strong>Genres:</strong> ${genres.map((genre) => genre.name).join(", ")}</p>
          <p>${overview}</p>
          <button id="backButton" class="btn btn-primary">Back to Movies</button>
        </div>
      </div>
    </div>
  `;

    // Tambahkan event listener untuk tombol "Back"
    document.querySelector("#backButton").addEventListener("click", () => {
      getNowPlayingList();
    });
  };

  const getMovieDetail = (movieId) => {
    displayLoading(true);
    fetch(movieDetailEndpoint(movieId), fetchOptions)
      .then((response) => response.json())
      .then((movie) => displayMovieDetail(movie))
      .catch((error) => {
        console.error(error);
        displayAlert("Terjadi kesalahan saat mengambil detail film.");
      });
  };

  // Event listener pada elemen "Detil"
  contentElm.addEventListener("click", function (event) {
    if (event.target.classList.contains("card-link")) {
      event.preventDefault(); // Mencegah reload halaman
      const movieId = event.target.dataset.id;
      getMovieDetail(movieId); // Panggil fungsi untuk detail film
    }
  });
//ini batasnya
  contentElm.addEventListener("click", function (event) {
    if (event.target.classList.contains("card-link")) {
      //   console.log(this.target);
      const movieId = event.target.dataset.id;
      //   panggil function untuk menampilkan detail film
    }
  });
  window.addEventListener("DOMContentLoaded", getNowPlayingList);
};
export default app;