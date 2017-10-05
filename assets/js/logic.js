function getInput(){
	console.log("test");
	$("titleDiv").text("");
	$("mediaDiv").html("");
	$("buttonDiv").html("");

	//Tittle
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
function movideData(){
	ajaxObject.response = response;
}

$(document).ready(function(){
	$("#videoBtn").hide();
	$(document).on("click", "#snapshotBtn", function(){
		$("video").hide();
		$(this).hide();
		$()
	});
	$(document).on("click", "#videoBtn", function(){
		$("canvas").hide();
		$(this).hide();
		$("#snapshotBtn").show()
		$("video").show();
	});
})