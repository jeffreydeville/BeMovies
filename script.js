const swiper = new Swiper('.swiper', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    loop: true,
});

const swiper_top = new Swiper('.swiper-top', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    loop: true,
});


// Le popup
const registerLink = document.getElementById('register-link'); // Le lien REGISTER
const containerRegister = document.querySelector('.container-register'); // La fenêtre popup
const closeBtn = document.querySelector('.close-btn'); // Le bouton de fermeture

// Afficher la popup au clic sur le lien REGISTER
registerLink.addEventListener('click', function(event) {
    event.preventDefault(); // Empêcher le comportement par défaut du lien
    containerRegister.style.display = 'block'; // Afficher la popup
});

// Fermer la popup au clic sur le bouton "X"
closeBtn.addEventListener('click', function() {
    containerRegister.style.display = 'none'; // Cacher la popup
});

// Derniers films en cours de diffusion (latest API)
const apiKey = '44cddd2779964bd2eb143cf8e569dae8'; // Remplace par ta clé API 
const apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;

const movieListContainer = document.getElementById('latest-movie-list');

// Fonction pour afficher les films dans le Swiper
function displayMovies(movies) {
    movieListContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('swiper-slide', 'movie-card');

        // Ajouter l'image du film
        const movieImage = document.createElement('img');
        movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        movieImage.alt = movie.title;
        movieCard.appendChild(movieImage);

        // Ajouter le titre et la note du film
        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie-info');
        movieInfo.innerHTML = `
            <div class="movie-name">${movie.title}</div>
            <div class="movie-years">${movie.release_date.split('-')[0]}</div>
            <div class="movie-rating">
                <span class="note">${movie.vote_average}</span>
            </div>
            <div class="star-rating">
                <img src="téléchargé.jpg" alt="Star" class="star-image">
            </div>
        `;
        
        movieCard.appendChild(movieInfo);

        // Ajouter la carte de film à la liste
        movieListContainer.appendChild(movieCard);
    });
    swiper.update();
}

// Fonction pour récupérer les films en cours de diffusion
async function fetchNowPlayingMovies() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const movies = data.results;

        // Afficher les films dans le DOM
        displayMovies(movies);
    } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
    }
}
fetchNowPlayingMovies();

// Swiper top pour la recherche de films
const searchButton = document.getElementById('search');

searchButton.addEventListener('click', () => {
    const searchInput = document.getElementById('movieInput').value.trim();
    console.log('Search Input:', searchInput); // Affiche l'entrée de recherche

    if (searchInput !== "") {
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchInput)}&language=en-US&page=1`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('Search Result:', data); // Affiche les résultats de recherche
                const movies = data.results;

                const swiperWrapper = document.querySelector('.swiper-top .swiper-wrapper');
                swiperWrapper.innerHTML = ""; // Vider le swiper avant d'ajouter les nouveaux films

                // Ajouter les films au swiper
                movies.forEach(movie => {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('swiper-slide', 'movie-card');

                    // Ajouter l'image du film
                    const movieImage = document.createElement('img');
                    movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                    movieImage.alt = movie.title;
                    movieCard.appendChild(movieImage);

                    // Ajouter le titre et la note du film
                    const movieInfo = document.createElement('div');
                    movieInfo.classList.add('movie-info');
                    movieInfo.innerHTML = `
                        <div class="movie-name">${movie.title}</div>
                        <div class="movie-years">${movie.release_date.split('-')[0]}</div>
                        <div class="movie-rating">
                            <span class="note">${movie.vote_average}</span>
                        </div>
                        <div class="star-rating">
                        </div>
                    `;
                    
                    movieCard.appendChild(movieInfo);
                    swiperWrapper.appendChild(movieCard);
                });

                // Afficher le swiper si ce n'est pas déjà visible
                document.querySelector('.swiper-top').style.display = 'block';

                // Mettre à jour le swiper
                swiper.update();
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des films:', error);
            });
    } else {
        console.log("Aucun film trouvé. Veuillez entrer un terme de recherche.");
    }
});

// swiper par genre en bas de page 
const genres = document.querySelectorAll('.genre'); // Sélectionner tous les éléments de genre

// Conteneur des films
const moviesContainer = document.getElementById('movies-container');

// Fonction pour afficher les films par genre
function displayMoviesgenre(movies) {
    moviesContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter les nouveaux films
    console.log('Movies by Genre:', movies); // Affiche les films par genre

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        const movieImage = document.createElement('img');
        movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        movieImage.alt = movie.title;
        movieCard.appendChild(movieImage);

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie-info');
        movieInfo.innerHTML = `
            <div class="movie-name">${movie.title}</div>
            <div class="movie-year">${movie.release_date.split('-')[0]}</div>
            <div class="movie-rating">${movie.vote_average}</div>
        `;
        movieCard.appendChild(movieInfo);
        
        moviesContainer.appendChild(movieCard);
    });
}

// Fonction pour récupérer les films par genre
async function fetchMoviesByGenre(genreId) {
    const genreApiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&with_genres=${genreId}`;
    console.log('Fetching movies for genre ID:', genreId);

    try {
        const response = await fetch(genreApiUrl);
        const data = await response.json();

        if (data.results.length === 0) {
            console.log('Aucun film trouvé pour ce genre.');
            return;
        }

        const movies = data.results;

        // Vider le conteneur
        const moviesContainer = document.getElementById('movies-container');
        moviesContainer.innerHTML = '';

        // Ajouter les films
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('swiper-slide', 'movie-card'); // Important

            const movieImage = document.createElement('img');
            movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            movieImage.alt = movie.title;
            movieCard.appendChild(movieImage);

            const movieInfo = document.createElement('div');
            movieInfo.classList.add('movie-info');
            movieInfo.innerHTML = `
                <div class="movie-name">${movie.title}</div>
                <div class="movie-year">${movie.release_date.split('-')[0]}</div>
                <div class="movie-rating">${movie.vote_average}</div>
            `;
            movieCard.appendChild(movieInfo);

            moviesContainer.appendChild(movieCard);
        });

        // Mettre à jour le Swiper
        genreSwiper.update();
    } catch (error) {
        console.error('Erreur lors de la récupération des films par genre:', error);
    }
}

// Ajouter un événement de clic à chaque genre
genres.forEach(genre => {
    genre.addEventListener('click', () => {
        const genreId = genre.getAttribute('data-genre'); // Récupérer l'ID du genre
        console.log('Genre ID clicked:', genreId); // Affiche l'ID du genre sélectionné
        fetchMoviesByGenre(genreId); // Récupérer et afficher les films pour ce genre
    });
});
