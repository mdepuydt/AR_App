var earthOpened = false;
var earth, earthOcclusion, earthIndicators;
var currentQRCode = null;
var notTrackingTimer = null;
var addr = "192.168.0.11";
var lastMarker = null;

function getTextureDetail(id) {
	detail = getDetail(id);
	//create an HTML5 Canvas
	canvas = document.createElement("canvas");
	canvas.width = detail.dim.width;
	canvas.height = detail.dim.height;
	//get a 2D context
	var context = canvas.getContext('2d');
	//draw transparent background
	context.fillStyle = "rgba(0, 0, 255, 0.4)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	//context.fillRect(0, 0, canvas.width, canvas.height);

	//draw text (current time)
	context.fillStyle = "white";
	context.font = 'bold 24pt Helvetica';
	context.fillText(id, 10, 50);
	context.font = '20pt Helvetica';
    context.fillText(detail.desc, 10, 110);
    context.fillText(detail.author, 10, 140);
    context.fillText(detail.date, 10, 180);
	//create image data from the canvas
	var newImageData = canvas.toDataURL();
	return new arel.Image(newImageData);
}

function getScrollableDiv(){
   	//create an HTML5 Div
   	canvas = document.createElement("canvas");
   	canvas.width = "100";
   	canvas.height = "50";
   	canvas.style.overflow = "scroll";
    //get a 2D context
    var context = canvas.getContext('2d');
    //draw transparent background
    context.fillStyle = "rgba(0, 0, 0, 0.4)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //draw text (current time)
    context.fillStyle = "white";
    context.font = 'bold 24pt Helvetica';
    context.fillText("Test", 10, 10);
    context.fillText("Test 2", 10, 55);
    context.font = '10pt Helvetica';
    //create image data from the canvas
    var newImageData = canvas.toDataURL();
    return new arel.Image(newImageData);
}

function add3DComments(com){

	if(myComment){
		for(var i=0; i < myComment.length; i++){
			console.log("remove");
			arel.Scene.removeObject(i);
		}
	}
	var myComment = [];
	for(var i=0; i < com.length; i++){
		var comment = getComment(com[i]);
		myComment[i] = new arel.Object.Model3D.createFromArelImage(i, comment);
        //myComment[i].setTranslation(arel.Vector3D.add(myComment.getTranslation(), new arel.Vector3D(100, 0-(i*100), 0)));
        myComment[i].setTranslation(new arel.Vector3D(400.0, 200.0-(i+1.0)*110.0, 1.0));
        arel.Scene.addObject(myComment[i]);
	}
	if(com.length > 4){
		//TODO créer flèche pour descendre
	}
}

function modifyComments(id){
	comments = getAnnotations(id);
	//create canvas scrollable
	canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 450;
    var context = canvas.getContext('2d');
    context.fillStyle = "rgba(0, 0, 0, 0.4)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.font = '24pt Helvetica';
    context.fillText("Comments:", 10, 30);
	// put all the comments in it but only 4 are visible
	var div = document.getElementById("scrollable");
	div.innerHTML = "Commentaire sur l'oeuvre:<br>";
	add3DComments(comments);
	for(var i = 0; i < comments.length; i++){
		context.fillText(comments[i].comment, 10, 30+(50*(i+1)));
		div.innerHTML += comments[i].comment;
		div.innerHTML += "<br>";
		div.innerHTML += "------";
		div.innerHTML += "<br>";


	}
	//var newComment = div;
   	//scroll = new arel.Image(newComment);
   	var scroll = getScrollableDiv();
   	myScroll = new arel.Object.Model3D.createFromArelImage("myScroll", scroll);
    myScroll.setScale(new arel.Vector3D(2.0, 2.0, 2.0));
    myScroll.setTranslation(new arel.Vector3D(400.0, 500.0, 1.0));
    arel.Scene.addObject(myScroll);
	//create image data from the canvas
	if(myObject){
		arel.Scene.removeObject(myObject);
	}
   	var image = getTextureDetail(id);
    myObject = new arel.Object.Model3D.createFromArelImage("myObject", image);
    myObject.setScale(new arel.Vector3D(5.0, 5.0, 5.0));
    arel.Scene.addObject(myObject);


}

function getComment(com) {
    //create an HTML5 Canvas
	canvas = document.createElement("canvas");
	canvas.width = 100;
	canvas.height = 50;
	//get a 2D context
	var context = canvas.getContext('2d');
	//draw transparent background
	context.fillStyle = "rgba(0, 0, 0, 0.4)";
	context.fillRect(0, 0, canvas.width, canvas.height);
	//draw text
	context.fillStyle = "black";
	context.font = '24pt Helvetica';
	context.fillText(com.comment, 10, 30);
	context.font = '16pt Helvetica';
    context.fillText(com.author, 10, 80);
    context.fillText(com.date, 320, 25);
	//create image data from the canvas
	var newImageData = canvas.toDataURL();
	return new arel.Image(newImageData);
	//return com.comment;
}

function sendMessage() {
	//TODO ne fonctionne pas quand bouton en haut 
    var comment = {};
    comment.comment = document.getElementById('message').value;
    document.getElementById('message').value = "";
    var today = new Date();
	comment.artwork = lastMarker;
    comment.date = today.getDate() + '/' + today.getMonth();
    comment.author = 'me';
    comments.push(comment);
	addAnnotation(JSON.stringify(comment));
    modifyComments(lastMarker);
}

function setPosition() {
	var elementStyle = document.getElementById("edit_message").style;
    elementStyle.position = "absolute";
    elementStyle.bottom = "305px";
}

function resetPosition() {
	var elementStyle = document.getElementById("edit_message").style;
    elementStyle.position = "absolute";
    elementStyle.bottom = "10px";
}

var myObject;

arel.ready(function()
{
	console.log("sceneReady");
    arel.Scene.setTrackingConfiguration("../TrackingData_MarkerlessFast.xml");
	//set a listener to tracking to get information about when the image is tracked
    arel.Events.setListener(arel.Scene, function(type, param){trackingHandler(type, param);});
	//acquire texture
    //var image = getTexture();
    //var comment = getComment('Test 1');
	//var image = new arel.Image(imageData);
    //create 3D model from image
    //myObject = new arel.Object.Model3D.createFromArelImage("myObject", image);
    //myComment = new arel.Object.Model3D.createFromArelImage("myComment", comment);
    //scale 3D model
    //myObject.setScale(new arel.Vector3D(5.0, 5.0, 5.0));
    //myComment.setScale(new arel.Vector3D(5.0, 5.0, 5.0));
    //myComment.setTranslation(new arel.Vector3D(470.0, 200.0, 4.0));
    //arel.Scene.addObject(myObject);
    //arel.Scene.addObject(myComment);
    //getComments();
});

function trackingHandler(type, param)
{
	//check if there is tracking information available
	if (param[0] !== undefined)
	{
		//if the pattern is found, hide the information to hold your phone over the pattern
		if (type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_TRACKING)
		{
			document.getElementById('info').style.display = "none";
			document.getElementById('scrollable').style.display = "block";
			document.getElementById('edit_message').style.display = "block";
			console.log(param[0].getCoordinateSystemName());
			lastMarker = param[0].getCoordinateSystemName();
			modifyComments(param[0].getCoordinateSystemName());
			if(arel.Events.GestureHandler.TRANSLATING_START){
				console.log("true");
			}
			if(arel.Events.Object.ONTOUCHSTARTED){
				console.log("true object");
			}
		}
		//if the pattern is lost tracking, show the information to hold your phone over the pattern
		else if (type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_NOTTRACKING)
		{
			document.getElementById('info').style.display = "block";
			document.getElementById('scrollable').style.display = "none";
			document.getElementById('edit_message').style.display = "none";
		}
	}
};

/**********************
	CLient
**********************/

// On récupère la liste des oeuvres d'art
function getArtworks() {
	var xml = new XMLHttpRequest();
	xml.open("GET", "http://"+addr+":4000/api/oeuvres", false);
	xml.setRequestHeader("Content-type", "application/json");
	xml.send();

	return JSON.parse(xml.responseText);
}

//On récupère le détail d'une oeuvre
function getDetail(id) {
	var xml = new XMLHttpRequest();
	xml.open("GET", "http://"+addr+":4000/api/oeuvre/"+id, false);
	xml.setRequestHeader("Content-type", "application/json");
	xml.send();

	return JSON.parse(xml.responseText);
}

//On récupère les annotations d'une oeuvre
function getAnnotations(id) {
	var xml = new XMLHttpRequest();
	xml.open("GET", "http://"+addr+":4000/api/comments/"+id, false);
	xml.setRequestHeader("Content-type", "application/json");
	xml.send();
	return JSON.parse(xml.responseText);
}

//On ajoute une annotation à une oeuvre
function addAnnotation(data) {
	var xml = new XMLHttpRequest();
	xml.open("POST", "http://"+addr+":4000/api/comment", false);
	xml.setRequestHeader("Content-type", "application/json");
	xml.send(data);
	return JSON.parse(xml.responseText);
}