/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

// Put variables in global scope to make them available to the browser console.
var video = document.querySelector('video');
var canvas = window.canvas = document.querySelector('canvas');
canvas.width = 480;
canvas.height = 0;
var dataURL;


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
      var scores = data[0].scores;
      // Returns the highest index in the emotion object in emotion object
      var highEmotion = Object.keys(scores).reduce((a,b) => { return scores[a] > scores[b] ? a : b});

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
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
then(handleSuccess).catch(handleError);