var earthOpened = false;
var earth, earthOcclusion, earthIndicators;
var currentQRCode = null;
var notTrackingTimer = null;

var comments = [{
    message: "Test 2",
    date: "Today",
    author: "me"
}];

function getTexture()
{
	//create an HTML5 Canvas
	canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 512;

	//get a 2D context
	var context = canvas.getContext('2d');

	//draw transparent background
	context.fillStyle = "rgba(0, 0, 255, 0.4)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	//draw text (current time)
	context.fillStyle = "white";
	context.font = 'bold 24pt Helvetica';
	context.fillText("Marilyn Monroe", 10, 50);
	context.font = '20pt Helvetica';
    context.fillText("Andy Warhol", 10, 80);
    context.fillText("1962", 10, 110);
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
	var newImageData = canvas.toDataURL();
	return new arel.Image(newImageData);
}

function getComments() {
    myComment = [];
    for(var i = 0; i < comments.length; i++){
        if(arel.Scene.objectExists(i)){
            arel.Scene.removeObject(i);
        }
        console.log(comments[i]);
        var new_comment = getComment(comments[i]);
        myComment[i] = new arel.Object.Model3D.createFromArelImage(i, new_comment);
        myComment[i].setTranslation(new arel.Vector3D(470.0, 200.0-i*120, 4.0));
        arel.Scene.addObject(myComment[i]);
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

	//acquire texture
    var image = getTexture();
    //var comment = getComment('Test 1');

    //create 3D model from image
    myObject = new arel.Object.Model3D.createFromArelImage("myObject", image);
    //myComment = new arel.Object.Model3D.createFromArelImage("myComment", comment);
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
	//check if there is tracking information available
	if (param[0] !== undefined)
	{
		//if the pattern is found, hide the information to hold your phone over the pattern
		if (type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_TRACKING)
		{
			document.getElementById('info').style.display = "none";
		}
		//if the pattern is lost tracking, show the information to hold your phone over the pattern
		else if (type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_NOTTRACKING)
		{
			document.getElementById('info').style.display = "block";
		}
	}
};
