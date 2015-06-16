var earthOpened = false;
var earth, earthOcclusion, earthIndicators;
var currentQRCode = null;
var notTrackingTimer = null;

var comments = [{
    comment: "Test 2",
    date: "Today",
    author: "me"
}];

function getTexture() {

	//create an HTML5 Canvas
	canvas = document.createElement("canvas");
	//canvas.width = getDetail(Patch1).dim.width;
	//canvas.height = getDetail(Patch1).dim.height;

	//get a 2D context
	var context = canvas.getContext('2d');

	//draw transparent background
	context.fillStyle = "rgba(0, 0, 255, 0.4)";
	context.fillRect(0, 0, 250, 250);
	//context.fillRect(0, 0, canvas.width, canvas.height);

	//draw text (current time)
	context.fillStyle = "white";
	context.font = 'bold 24pt Helvetica';
	context.fillText("Marilyn Monroe", 10, 50);
	context.font = '20pt Helvetica';
    //context.fillText(getDetail(Patch1).author, 10, 80);
    //context.fillText(getDetail(Patch1).author, 10, 110);
    //context.fillText(getDetail(Patch1).desc, 10, 110);
    context.fillText("Sérigraphie - acrylique sur toile", 10, 140);
    context.fillText("Image provenant du film Niagara", 10, 180);
	//create image data from the canvas
	var newImageData = canvas.toDataURL();
	return new arel.Image(newImageData);
}

function getComment(com) {
    //create an HTML5 Canvas
	canvas = document.createElement("canvas");
	canvas.width = 400;
	canvas.height = 100;

	//get a 2D context
	var context = canvas.getContext('2d');

	//draw transparent background
	context.fillStyle = "rgba(0, 0, 0, 0.4)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	//draw text
	context.fillStyle = "black";
	context.font = '24pt Helvetica';
	context.fillText(com.message, 10, 30);
	context.font = '16pt Helvetica';
    context.fillText(com.author, 10, 80);
    context.fillText(com.date, 320, 25);
	//create image data from the canvas
	//var newImageData = canvas.toDataURL();
	//return new arel.Image(newImageData);
	return com.message;
}

function getComments() {
    myComment = [];
    /*test = getAnnotations("MarkerlessCOS2");
    console.log("test "+test);*/
    for(var i = 0; i < comments.length; i++){
        if(arel.Scene.objectExists(i)){
            arel.Scene.removeObject(i);
        }
        var new_comment = getComment(comments[i]);

        document.getElementById("scrollable").innerHTML = new_comment;
        //Ajouter la div directement en objet 3D. Traiter le reste en HTML et recharger
    	//myComment[i] = new arel.Object.Model3D.createFromArelImage(i, new_comment);
        //myComment[i].setTranslation(new arel.Vector3D(470.0, 200.0-i*120, 4.0));
        //arel.Scene.addObject(myComment[i]);
    }
}



function sendMessage() {
    var comment = {};
    comment.message = document.getElementById('message').value;
    var today = new Date();

    comment.date = today.getDate() + '/' + today.getMonth();
    comment.author = 'me';
    comments.push(comment);

    console.log(comments.length);

    getComments();
}


var myObject;

arel.sceneReady(function()
{
	console.log("sceneReady");
    arel.Scene.setTrackingConfiguration("../TrackingData_MarkerlessFast.xml");
	//set a listener to tracking to get information about when the image is tracked
	/*art = getArtworks();
	console.log("Get oeuvres "+art);*/
    arel.Events.setListener(arel.Scene, function(type, param){trackingHandler(type, param);});

	//acquire texture
    var image = getTexture();
    //var comment = getComment('Test 1');

    //create 3D model from image
    myObject = new arel.Object.Model3D.createFromArelImage("myObject", image);
    myComment = new arel.Object.Model3D.createFromArelImage("myComment", comment);
    //scale 3D model
    myObject.setScale(new arel.Vector3D(5.0, 5.0, 5.0));
    //myComment.setScale(new arel.Vector3D(5.0, 5.0, 5.0));
    //myComment.setTranslation(new arel.Vector3D(470.0, 200.0, 4.0));
    arel.Scene.addObject(myObject);
    //arel.Scene.addObject(myComment);

    getComments();


});

function trackingHandler(type, param)
{
    console.log(type);
    console.log(param[0]);
	//check if there is tracking information available
	if (param[0] !== undefined)
	{
		//if the pattern is found, hide the information to hold your phone over the pattern
		if (type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_TRACKING)
		{
			document.getElementById('info').style.display = "none";
			document.getElementById('scrollable').style.display = "block";
			console.log(param[0].getCoordinateSystemName());
			if(param[0].getCoordinateSystemName() == "MarkerlessCOS2"){
			    console.log('in');
			}
		}
		//if the pattern is lost tracking, show the information to hold your phone over the pattern
		else if (type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_NOTTRACKING)
		{
			document.getElementById('info').style.display = "block";
			document.getElementById('scrollable').style.display = "none";
		}
	}
};

/**********************
	CLient
**********************/

// On récupère la liste des oeuvres d'art
function getArtworks() {
	var xml = new XMLHttpRequest();
	xml.open("GET", "http://localhost:4000/api/oeuvres", false);
	xml.setRequestHeader("Content-type", "application/json");
	xml.send();

	return JSON.parse(xml.responseText);
}

//On récupère le détail d'une oeuvre
function getDetail(id) {
	var xml = new XMLHttpRequest();
	xml.open("GET", "http://localhost:4000/api/oeuvre/"+id, false);
	xml.setRequestHeader("Content-type", "application/json");
	xml.send();

	return JSON.parse(xml.responseText);
}

//On récupère les annotations d'une oeuvre
function getAnnotations(id) {
	var xml = new XMLHttpRequest();
	xml.open("GET", "http://localhost:4000/api/comments/"+id, false);
	xml.setRequestHeader("Content-type", "application/json");
	xml.send();

	return JSON.parse(xml.responseText);
}

//On ajoute une annotation à une oeuvre
function getAnnotations(data) {
	var xml = new XMLHttpRequest();
	xml.open("POST", "http://localhost:4000/api/comment", false);
	xml.setRequestHeader("Content-type", "application/json");
	xml.send(data);

	return JSON.parse(xml.responseText);
}