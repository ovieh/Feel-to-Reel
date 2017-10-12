(function () {
	//'use strict';

	// Put variables in global scope to make them available to the browser console.
	var video = document.querySelector('video');
	var canvas = window.canvas = document.querySelector('canvas');
	canvas.width = 480;
	canvas.height = 0;
	var highEmotion = null;
	var dataURL;
	var localstream;
	var results;
	var uid;
	var videoObject = {
		constraints: {
			audio: false,
			video: true
		},
		handleSuccess: function (stream) {
			window.stream = stream; // make stream available to browser console
			video.srcObject = stream;
			localstream = stream;
		},
		handleError: function (error) {
			console.log('navigator.getUserMedia error: ', error);
		},
		vidOn: function () {
			navigator.mediaDevices.getUserMedia(this.constraints).
			then(this.handleSuccess).catch(this.handleError);
		},
		vidOff: function () {
			video.pause();
			video.src = "";
			localstream.getTracks()[0].stop();
		}
	};

	// Initialize Firebae
	var config = {
		apiKey: "AIzaSyAynPxThM6T3tphifpPEvBGMdDb4xRHkRQ",
		authDomain: "feel-to-reel.firebaseapp.com",
		databaseURL: "https://feel-to-reel.firebaseio.com",
		projectId: "feel-to-reel",
		storageBucket: "feel-to-reel.appspot.com",
		messagingSenderId: "817122802812"
	};
	firebase.initializeApp(config);

	// Get a reference to the database service
	const database = firebase.database();

	const btnSignIn = document.getElementById('sign-in');

	//Write to Firebase database
	let writeUserData = (uid, emotion) => {
		firebase.database().ref('users/' + uid).set({
			emotion: emotion
		});
	}


	let toggleSignIn = () => {
		if (!firebase.auth().currentUser) {
			// Creates instance of Github provider object
			var provider = new firebase.auth.GithubAuthProvider();

			//Prompt user for sign in
			firebase.auth().signInWithRedirect(provider);

		} else {
			firebase.auth().signOut();
		}
		btnSignIn.disabled = true;
	}


	function setEmotion(emotion) {
		highEmotion = emotion;
		return highEmotion;
	}

	let initApp = () => {

		firebase.auth().getRedirectResult().then(function (result) {
			if (result.credential) {
				// This gives you a GitHub Access Token. You can use it to access the GitHub API.
				var token = result.credential.accessToken;
				// ...
			}
			// The signed-in user info.
			var user = result.user;
		}).catch(function (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;
			// ...
		});

		//User listener
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				var displayName = user.displayName;
				var email = user.email;
				var photoURL = user.photoURL;
				var isAnonymous = user.isAnonymous;
				uid = user.uid;
				var providerData = user.providerData;

				//Loads movies if user is logged in
				if (highEmotion !== null) {
					whichMovies(highEmotion);
				} else {
					const usersRef = database.ref('users/');
					usersRef.on("value", (snapshot) => {
						const user = snapshot.child(uid).val();
						let emotion = user.emotion;
						setEmotion(emotion);
						whichMovies(highEmotion);

					}, function (error) {
						console.log("Error: " + error.code);
					});
				}
				btnSignIn.textContent = 'Sign out';

				var cameraBtn = document.querySelector('button');
				cameraBtn.onclick = function () {
					canvas.width = video.videoWidth;
					canvas.height = video.videoHeight;
					canvas.getContext('2d').
					drawImage(video, 0, 0, canvas.width, canvas.height);

					dataURL = canvas.toDataURL("image/png");

					var makeblob = function (dataURL) {
						var BASE64_MARKER = ';base64,';
						if (dataURL.indexOf(BASE64_MARKER) == -1) {
							var parts = dataURL.split(',');
							var contentType = parts[0].split(':')[1];
							var raw = decodeURIComponent(parts[1]);
							return new Blob([raw], {
								type: contentType
							});
						}
						var parts = dataURL.split(BASE64_MARKER);
						var contentType = parts[0].split(':')[1];
						var raw = window.atob(parts[1]);
						var rawLength = raw.length;

						var uInt8Array = new Uint8Array(rawLength);

						for (var i = 0; i < rawLength; ++i) {
							uInt8Array[i] = raw.charCodeAt(i);
						}

						return new Blob([uInt8Array], {
							type: contentType
						});

					};

					// console.log(dataURL);
					var params = {
						// Request parameters
					};

					$.ajax({
							// NOTE: You must use the same location in your REST call as you used to obtain your subscription keys.
							//   For example, if you obtained your subscription keys from westcentralus, replace "westus" in the 
							//   URL below with "westcentralus".
							url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?" + $.param(params),
							beforeSend: function (xhrObj) {
								// Request headers
								xhrObj.setRequestHeader("Content-Type", "application/octet-stream");

								// NOTE: Replace the "Ocp-Apim-Subscription-Key" value with a valid subscription key.
								xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "d8c7aa1767df41c0aa08d36223895b0c");
							},
							type: "POST",
							// Request body
							// data: '{"url": canvas.toDataURL()}',
							data: makeblob(dataURL),
							processData: false,

						})
						.done(function (data) {
							alert("success");
							if (typeof data[0] !== "undefined") {
								var scores = data[0].scores;
								// Returns the highest index in the emotion object in emotion object
								highEmotion = Object.keys(scores).reduce((a, b) => {
									return scores[a] > scores[b] ? a : b;
								});
								writeUserData(uid, highEmotion);

								whichMovies(highEmotion);
							} else {
								alert("Please take another picture");
							}
						})
						.fail(function () {
							alert("error");
						});

				};

				videoObject.vidOn();
				$("canvas").addClass("hide");
				console.log("hide");
				//Replaces with videoObject

				// var constraints = {
				//   audio: false,
				//   video: true
				// };

				// function handleSuccess(stream) {
				//   window.stream = stream; // make stream available to browser console
				//   video.srcObject = stream;
				//   localstream = stream;
				// }

				// function handleError(error) {

				//   console.log('navigator.getUserMedia error: ', error);
				// }

				// navigator.mediaDevices.getUserMedia(constraints).
				// then(handleSuccess).catch(handleError);


			} else {
				console.log("didn't work");
				btnSignIn.textContent = 'Sign-In';

			}
			btnSignIn.disabled = false;


		});
		btnSignIn.addEventListener('click', toggleSignIn, false);

	}
	// Empty variable to hold URL which will change depending on emotion detected
	var queryURL = "";

	function whichMovies(highEmotion) {
		$("#movieList").empty();

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

		} else if (highEmotion == "happiness") {

			queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + movieAPI + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" + comedy + "%2C%20" + music;

		} else {
			console.log("No emotion!!!");
		}

		ajaxCall();

	}

	// AJAX Call to the Movie Database API
	function ajaxCall() {
		$.ajax({
			url: queryURL,
			method: 'GET'
		}).done(function (response) {

			results = response.results;

			console.log(results);

			for (var i = 0; i < 9; i++) {

				var movieDiv = $("<div>");

				movieDiv.addClass("col s4 m4 movie-div");

				var poster = $("<img>");

				poster.addClass("responsive-img poster modal-trigger");

				poster.attr("src", "https://image.tmdb.org/t/p/w640/" + results[i].poster_path);

				movieDiv.append(poster);

				var floatingButton = '<a class="btn-floating waves-effect waves-light red movie-button"><i class="material-icons">add</i></a>';

				movieDiv.append(floatingButton);

				movieDiv.attr("data-value", i);

				$("#movieList").append(movieDiv);

			}
		})

	}

	function displayModal(x) {

		$("#card-summary").empty();

		$("#backdrop-image").empty();

		$(".card-title-text").text("");

		$("#backdrop-image").attr("src", "https://image.tmdb.org/t/p/w640" + results[x].backdrop_path);

		var title = results[x].title;
		var bTag = $("<b>");
		bTag.addClass("flow-text");
		bTag.append(title);
		$(".card-title-text").append(bTag);


		$("#theaters-link").attr("href", "https://www.fandango.com/search/?q=" + title + "&mode=Movies");

		$("#streaming-link").attr("href", "http://www.canistream.it/search/movie/" + title);

		var releaseDate = results[x].release_date;

		var releaseDateConverted = moment(releaseDate).format("MMMM D, YYYY");

		var releaseDateConvertedDisplay = $("<p>").text("Release Date: " + releaseDateConverted);
		releaseDateConvertedDisplay.addClass("flow-text");
		$("#card-summary").append(releaseDateConvertedDisplay);

		var plotSummary = $("<p>").text(results[x].overview);
		plotSummary.addClass("flow-text");
		$("#card-summary").append(plotSummary);
	}

	$(document).ready(function () {

		//Initialize modals
		$(".modal").modal();

		//When snapshotBtn is click
		$(document).on("click", "#snapshotBtn", function () {
			$("video").addClass("hide");
			$(this).addClass("hide");
			$("#videoBtn").removeClass("disabled");
			$("canvas").removeClass("hide");
			videoObject.vidOff();
		});
		$(document).on("click", "#videoBtn", function () {
			$("#movieList").html("");
			$("canvas").addClass("hide");
			$(this).addClass("disabled");
			$("#snapshotBtn").removeClass("hide")
			$("video").removeClass("hide");
			videoObject.vidOn();
		});
		//Modal
		$(document).on("click", ".movie-button", function () {
			$("#modal1").modal("open");
			displayModal($(this).parent().attr("data-value"));
		});

		initApp();

	});
}()); //IFFE