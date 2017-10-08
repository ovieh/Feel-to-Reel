  'use strict';

  // Put variables in global scope to make them available to the browser console.
  var video = document.querySelector('video');
  var canvas = window.canvas = document.querySelector('canvas');
  canvas.width = 480;
  canvas.height = 0;
  var dataURL;
  var highEmotion = "";
  var localstream;
  var results;
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

  // Creates instance of Github provider object
  var provider = new firebase.auth.GithubAuthProvider();


  //Prompt user for sign in
  firebase.auth().signInWithPopup(provider);

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
      var uid = user.uid;
      var providerData = user.providerData;
      console.log(displayName);

    } else {
      console.log("didn't work");
    }

  });



  // Empty variable to hold URL which will change depending on emotion detected

  var queryURL = "";


  function whichMovies() {

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

        movieDiv.addClass("col s4 m4");
        var poster = $("<img>");

        poster.addClass("responsive-img poster modal-trigger");

        poster.attr("src", "https://image.tmdb.org/t/p/w640/" + results[i].poster_path);
        poster.attr("data-value", i);
        movieDiv.append(poster);

        $("#movieList").append(movieDiv);

      }
    })

  }

  function displayModal(x) {

    $(".card-content").empty();

    $(".card-image").empty();

    var backdropImage = $("<img>");

    backdropImage.addClass("responsive-img backdrop-image");

    backdropImage.attr("src", "https://image.tmdb.org/t/p/w640" + results[x].backdrop_path);

    $(".card-image").html(backdropImage);

    var title = $("<h4>").text(results[x].title);

    $(".card-content").append(title);

    var releaseDate = results[x].release_date;

    var releaseDateConverted = moment(releaseDate).format("MMMM D, YYYY");

    var releaseDateConvertedDisplay = $("<p>").text("Release Date: " + releaseDateConverted);

    $(".card-content").append(releaseDateConvertedDisplay);

    var plotSummary = $("<p>").text(results[x].overview);

    $(".card-content").append(plotSummary);

  }
  /*
   *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
   *
   *  Use of this source code is governed by a BSD-style license
   *  that can be found in the LICENSE file in the root of the source
   *  tree.
   */


  //I think this takes a still and displays it
  var button = document.querySelector('button');
  button.onclick = function () {
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
            return scores[a] > scores[b] ? a : b
          });

          //Shuts video off
          // vidOff();
          whichMovies();
        } else {
          alert("Please take another picture");
        }


        console.log(highEmotion);
      })
    .fail(function () {
      alert("error");
    });

  };
  console.log(dataURL);

  var constraints = {
    audio: false,
    video: true
  };

  function handleSuccess(stream) {
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;
    localstream = stream;
  }

  function handleError(error) {

    console.log('navigator.getUserMedia error: ', error);
  }

  navigator.mediaDevices.getUserMedia(constraints).
  then(handleSuccess).catch(handleError);


  var vidOff = () => {
    video.pause();
    video.src = "";
    localstream.getTracks()[0].stop();
  }

  /*
  ---------------------------Display---------------------------
  -------------------------------------------------------------
  */
  function displayLoading() {
    console.log("test");
    $("titleDiv").text("");
    $("mediaDiv").html("");
    $("buttonDiv").html("");

    //Title
    var hDiv = $("<h1>").addClass("center-align").text("Feel to Reel");
    $("#titleDiv").append(hDiv);

    //Video and canvas
    var vidDiv = $("<video>");
    var canDiv = $("<canvas>");

    $("#mediaDiv").append(vidDiv);
    $("#mediaDiv").append(canDiv);

    //Creating the buttons
    var camBtn = $("<button>").html("<i class='small material-icons'>camera_alt</i>");
    var vidBtn = $("<button>").html("<i class='small material-icons'>videocam</i>");

    camBtn.addClass("btn waves-effect");
    vidBtn.addClass("btn waves-effect");

    camBtn.attr("id", "snapshotBtn");
    vidBtn.attr("id", "videoBtn");

    $("#buttonDiv").append(vidBtn);
    $("#buttonDiv").append(camBtn);
  }

  $(document).ready(function () {
    $(".modal").modal()

    //$(document).on("click", "#snapshotBtn", whichMovies);
    $("#videoBtn").hide();
    $(document).on("click", "#snapshotBtn", function () {
      $("video").hide();
      $(this).hide();
      $("#videoBtn").show();
      $("canvas").show();
      vidOff();

    });
    $(document).on("click", "#videoBtn", function () {
      $("canvas").hide();
      $(this).hide();
      $("#snapshotBtn").show()
      $("video").show();

    });
    //Modal
    $(document).on("click", ".poster", function () {

      $("#modal1").modal("open");
      displayModal($(this).attr("data-value"));



    });

    $("#modal1").on("open", function () {

      $(this).find('.modal').css({
        width:'auto',
        height:'auto',
        'max-height':'100%'

        console.log(success with modal);

      });

    })