$(document).on("click", "SUBMIT BUTTON", displayMovies);

function displayMovies () {

// AJAX call to the Movie Database API

$("#movie-view").empty();


//// Which genre will match with which emotion? 
// anger = action, crime, thriller
// contempt = documentary, history
// disgust = science fiction
// fear = horror, mystery
// neutral = drama
// sadness = romance, drama
// surprise = fantasy, adventure
// happiness = comedy, music

// Variables holding the genre IDs needed for the API call

var action = "28";
var adventure = "12";
var comedy = "35";
var crime = "80";
var documentary = "99";
var drama = "18";
var fantasy = "14";
var history = "36";
var horror = "27";
var music = "10402";
var mystery = "9648";
var romance = "10749";
var scienceFiction = "878";
var thriller = "53";

// Empty variable to hold URL which will change depending on emotion detected

var queryURL = "";

// Movie Database API key

var = movieAPI = "aed8a1ce3108479482ae5d0e4cbb536a";

// If statements that determine which URL will be called

if (emotion === anger) {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + action + "%2C%20" + crime + "%2C%20" + thriller; 

} else if (emotion === contempt) {

	

}
}

// AJAX Call to the Movie Database API

function ajaxCall () {

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {

		console.log(response);

	}
}