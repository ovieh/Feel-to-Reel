$(document).on("click", "SUBMIT BUTTON", displayMovies);

function displayMovies () {

// AJAX call to the Giphy API

$("#movie-view").empty();

// anger = action, crime, thriller
// contempt = documentary, history
// disgust = science fiction
// fear = horror, mystery
// neutral = drama
// sadness = romance, drama
// surprise = fantasy, adventure
// happiness = comedy, music

var action = "";
var adventure = "";
var comedy = "";
var crime = "";
var documentary = "";
var drama = "";
var fantasy = "";
var history = "";
var horror = "";
var music = "";
var mystery = "";
var romance = "";
var scienceFiction = "";
var thriller = "";

var queryURL = 

$.ajax({
	url: queryURL,
	method: 'GET'
}).done(function(response) {

	console.log(response);