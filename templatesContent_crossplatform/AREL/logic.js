var earthOpened = false;
var earth, earthOcclusion, earthIndicators;
var currentQRCode = null;
var notTrackingTimer = null;
// variable à changer suivant l'adresse IP sur laquelle le serveur tourne
var addr = "172.20.10.2";
var lastMarkerId = null;
var myScroll;
var obj = [];
var myObject;

arel.ready(function() {
    arel.Scene.setTrackingConfiguration("../TrackingData_MarkerlessFast.xml");
	//set a listener to tracking to get information about when the image is tracked
    arel.Events.setListener(arel.Scene, function(type, param){trackingHandler(type, param);});
    document.getElementById('edit_message').style.display = "none";
    document.getElementById('info').style.display = "block";
    document.getElementById('scrollable').style.display = "none";
});


function updateLastMarkerName(name){
	document.getElementById('message').placeholder = 'Commenter ' +name;
}

function getTextureDetail(detail) {
	//create an HTML5 Canvas
	canvas = document.createElement("canvas");
	canvas.width = detail.dim.width;
	canvas.height = detail.dim.height;
	//get a 2D context
	var context = canvas.getContext('2d');
	//draw transparent background
	context.fillStyle = "rgba(0, 0, 255, 0.4)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	//draw text (current time)
	context.fillStyle = "white";
	context.font = 'bold 24pt Helvetica';
	context.fillText(detail.title, 10, 50);
	context.font = '20pt Helvetica';

    if(detail.desc.length > 25){
    	var array = detail.desc.split(" ");
    	var lines = [];
    	var line ="";
    	var i= 0;
    	while(lines.length < (detail.desc.length%25)){
    		console.log(line);
    		while(line.length < 25 && i < array.length){
    			console.log(line);
    			if(array[i+1]){
    				line += array[i].concat(" "+array[i+1]+" ");
    			} else {
    				line += array[i];
    			}
                i+=2;
            }
            lines.push(line);
            context.fillText(line, 10, 80+(lines.length*30));
            line = "";
    	}
    	//context.fillText("longue description", 10, 140);
    } else {
    	context.fillText(detail.desc, 10, 110);
    }
    context.fillText(detail.author, 10, 240);
    context.fillText(detail.date, 10, 280);

	//create image data from the canvas
	var newImageData = canvas.toDataURL();
	return new arel.Image(newImageData);
}

function getScrollableDiv(detail, comments) {
   	//create an HTML5 Div
   	canvas = document.createElement("canvas");
   	canvas.width = detail.dim.width;
   	canvas.height = detail.dim.height;
   	canvas.style.overflow = "scroll";

    //get a 2D context
    var context = canvas.getContext('2d');
    //draw transparent background
    context.fillStyle = "rgba(0, 0, 0, 0.4)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //draw text
    context.fillStyle = "white";
    context.font = '16pt Helvetica';
    var double = 0;
    for(var i=comments.length-1; i >= 0; i--){
	if(i%2==0){
		context.font = 'bold 16pt Helvetica';
	} else {
		context.font = '16pt Helvetica';
	}
	// afficher les longs commentaires sur 2 lignes
   	if(comments[i].comment.length > 40){
            	var array = comments[i].comment.split(" ");
            	var line2 = array[array.length-4].concat(" "+array[array.length-3]+" "+array[array.length-2]+" "+array[array.length-1]);
            	console.log(line2);
            	var line1 = "";
            	for(var j=0; j < array.length-4; j++){
					line1 += array[j].concat(" ");
            	}
            	double++;
            	context.fillText(line1, 10, 40*((comments.length-i)+1)-40);
            	context.fillText(line2, 10, 40*((comments.length-i+double)+1)-50);
            } else {
            	context.fillText(comments[i].comment, 10, 40*((comments.length-i+double)+1)-40);
            }

    }

    //create image data from the canvas
    var newImageData = canvas.toDataURL();
    return new arel.Image(newImageData);
}

function modifyComments(id) {
	comments = getAnnotations(id);
	// ajouter en AR les détails sur le tableau
	var detail = getDetail(id);
	updateLastMarkerName(detail.title);
    var image = getTextureDetail(detail);
    myObject = new arel.Object.Model3D.createFromArelImage("myObject", image);
    myObject.setScale(new arel.Vector3D(5.0, 5.0, 5.0));
    myObject.setCoordinateSystemID(id);
    obj.push(myObject);

	// affichage des commentaires en AR
   	var scroll = getScrollableDiv(detail, comments);
   	myScroll = new arel.Object.Model3D.createFromArelImage("myScroll", scroll);
    myScroll.setScale(myObject.getScale());
    myScroll.setTranslation(new arel.Vector3D(0.0, -(detail.dim.height+(detail.dim.height/4)), 0.0));
    myScroll.setCoordinateSystemID(id);
    obj.push(myScroll);
    arel.Scene.setObjects(obj);
}

function sendMessage() {
    if (document.getElementById("message").value != ''){
		var comment = {};
		comment.comment = document.getElementById('message').value;
		var today = new Date();
		comment.artwork = lastMarkerId;
		comment.date = today;
		comment.author = 'me';
		comments.push(comment);
		addAnnotation(JSON.stringify(comment));
		document.getElementById('message').value = ("");
		modifyComments(lastMarkerId);
    }
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
    sendMessage();
}


var myObject;

arel.ready(function() {
    arel.Scene.setTrackingConfiguration("../TrackingData_MarkerlessFast.xml");
	//set a listener to tracking to get information about when the image is tracked
    arel.Events.setListener(arel.Scene, function(type, param){trackingHandler(type, param);});
    document.getElementById('edit_message').style.display = "none";
    document.getElementById('info').style.display = "block";
});

function trackingHandler(type, param)
{
	//check if there is tracking information available
	if (param[0] !== undefined)
	{	//if the pattern is found, hide the information to hold your phone over the pattern
		if (type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_TRACKING)
		{
			if(arel.Events.Object.ONTOUCHSTARTED){
				console.log(arel.Events.Object.ONTOUCHSTARTED);

			}
			if(myScroll){
				console.log("in");
				if(myScroll.ONTOUCHSTARTED){
                	console.log("touche touche");
               	}
			}
			document.getElementById('info').style.display = "none";
			document.getElementById('edit_message').style.display = "block";
			lastMarkerId = param[0].getCoordinateSystemID();
			modifyComments(lastMarkerId);
		}
		//if the pattern is lost tracking, show the information to hold your phone over the pattern
		else if (type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_NOTTRACKING)
		{
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