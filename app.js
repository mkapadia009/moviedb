const search = document.getElementById("movieName").value;

const API_KEY = '250e8ff824c99a9c497cf138f87d980b';
const BASE_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`


const posterImage = 'https://image.tmdb.org/t/p/w500/';

const matchList = document.getElementById("match-list");
const DispMovie = document.getElementById('movies');
const DispRecom = document.getElementById('list');
const DispVideo = document.getElementById('video-section');



// matchList.addEventListener("click", (e) => {
//     if (e.composedPath().find((element) => { 
//         return element.classList?.contains('movie-item');
//     })) {
//         console.log('movie clicked');
//     }

//     e.stopPropagation();
// });


const searchMovie = function getMovie() {
    let movieName = document.getElementById('movieName').value;
    let url = `${BASE_URL}${movieName}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            let matches = data.results.filter((movie) => {
                const regex = new RegExp(`^${movieName}`, "gi");
                return movie.title.match(regex);
            });
            console.log(matches);
            if (movieName.length === 0) {
                matches = [];
            }
            updateHtml(matches);
        });

};



const updateHtml = (matches) => {
    if (matches.length > 0) {
        const html = matches
            .map(
                (match) => `
            <div class="card card-body mb-1 movie-item" data-movie-id="">
                <a onclick="movieSelect('${match.id}')">${match.title}</a>
            </div>
          `
            )
            .join("");
        matchList.innerHTML = html;
    }
};

function movieSelect(id) {
    emptyMatchList();

    getMovie(id).then((response) => {
        console.log(response);
        displayMovieData(response);
    });
}

function displayMovieData(movie) {


    DispMovie.innerHTML = "";
    DispRecom.innerHTML = "";
    DispVideo.innerHTML = "";





//    The below section is to get the recommendations of that particular movie

    let movieId = movie.id;
    console.log(movieId);

    let url = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`;
    console.log(url);

    let recommendedList = fetch(url)
        .then((response) => response.json())
        .then((data) => {

            let recommendedMovies = data.results.forEach(element => {
                const recom = `<li class="list-group-item">${element.title}</li>`;
                DispRecom.innerHTML += recom;
            });
        })

// The below section is for fetching details for the video trailers.

    let url2 = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
    console.log(url2);

    let getVideos = fetch(url2)
        .then((response) => response.json())
        .then((data) => {



            let videoList = data.results.forEach(element => {
                const video = `<iframe class="embed-responsive-item" id="player" type="text/html" width="480" height="340"
             src="https://www.youtube.com/embed/${element.key}?enablejsapi=1&origin=http://example.com"
             frameborder="0"></iframe>`;
                DispVideo.innerHTML += video;
            })

        })

// Inserting the movie title, poster etc in the Jumbotron.        

    const html = `
        <div class="jumbotron">
            <h1>${movie.title}</h1>
            <div class = "row">
              <div class = "col-4">
                <img style="width: 100%" src=${posterImage}${movie.poster_path}></div>
              <div class = "col-8">
                <p>${movie.overview}<p>
                <p>Release date: ${movie.release_date}</p>

                <p class ="rating"><span></span>Rating: ${movie.vote_average}/10</p> 
              </div>
            </div>
        </div>`
    DispMovie.innerHTML = html;
}

// Below are functions written to empty the match list after initial search

function emptyMatchList() {
    matchList.innerHTML = '';
}

async function getMovie(id) {
    let url = `https://api.themoviedb.org/3/movie/${id}?api_key=250e8ff824c99a9c497cf138f87d980b&language=en-US`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}