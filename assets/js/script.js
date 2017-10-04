// Empty variable to hold URL which will change depending on emotion detected

var queryURL = "";

$(document).on("click", "#takeSnapshot", whichMovies);

function whichMovies () {

$("#test-div").empty();

console.log("my file: " + highEmotion);

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

// Movie Database API key

var movieAPI = "aed8a1ce3108479482ae5d0e4cbb536a";

// If statements that determine which URL will be called

if (highEmotion == "anger") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + action + "%2C%20" + crime + "%2C%20" + thriller; 

} else if (highEmotion == "contempt") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + documentary + "%2C%20" + history;

} else if (highEmotion == "disgust") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + scienceFiction;

} else if (highEmotion == "fear") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + horror + "%2C%20" + mystery;

} else if (highEmotion == "neutral") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + drama;

} else if (highEmotion == "sadness") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + romance + "%2C%20" + drama;

} else if (highEmotion == "surprise") {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + fantasy + "%2C%20" + adventure;

} else {

	queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + comedy + "%2C%20" + music;

}

ajaxCall ();

}

// AJAX Call to the Movie Database API

function ajaxCall () {

	$.ajax({
		url: queryURL,
		method: 'GET'
	}).done(function(response) {

		var results = response.results;

		console.log(results);

		for (var i = 0; i < 10; i++) {

			var movieDiv = $("<div>");

    		var poster = $("<img>");

    		poster.addClass("poster");

    		poster.attr("src", "https://image.tmdb.org/t/p/w640/" + results[i].poster_path);

    		movieDiv.append(poster);

    		var title = $("<p>").text(results[i].title);

    		movieDiv.append(title);

    		var plotSummary = $("<p>").text(results[i].overview);

    		movieDiv.append(plotSummary);

    		$("#test-div").append(movieDiv);
		}
	})
}