/*******************************
		REQUIREMENTS
*******************************/

var fs = require('fs');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

/*******************************
			GLOBAL VARS
*******************************/

/*****************************************************************
liste_oeuvres contient la liste des oeuvres du musée avec pour chaque artwork:
	-id: marker utilisé par l'application pour tracker l'oeuvre
	-desc: description de l'oeuvre
	-author: auteur de l'oeuvre
	-date: date de réalisation de l'oeuvre
	-dim: dimensions de l'oeuvre
		-width: largeur de l'oeuvre
		-height: hauteur de l'oeuvre
******************************************************************/

var liste_oeuvres = [];

/*****************************************************************
liste_annotations contient la liste des annotations du musée avec pour chaque annotation:
	-id: identifiant unique de l'annotation
	-artwork: id de l'oeuvre concernée
	-author: auteur de l'annotation
	-date: date d'neregistrement de l'annotation
	-comment: texte de l'annotation
******************************************************************/

var liste_annotations = [];

/*******************************
			Code
*******************************/

init();

//TODO vérifier si utile
function findIndexOf (property, value, array) {

	for (var i=0; i< array.length; i++){
		if (array[i][property] == value){
			return i;
		}
	}

	return -1;
}

// Lire les json pour mettre dans les varaibles globales la liste des oeuvres et des annotations existantes
function init () {
	fs.readFile('listeAnnotations.json', 'utf8', setAnnotations);
	fs.readFile('listeOeuvres.json', 'utf8', setOeuvres);
}

function setAnnotations (err, data) {
	if (err) return console.log(err);
	var artworks = JSON.parse(data);
	for (var i = 0; i < artworks.length; i++){
		setAnnotation(artworks[i]);
	}
}

function setOeuvres (err, data) {
	if (err) return console.log(err);
	var artworks = JSON.parse(data);
	for (var i = 0; i < artworks.length; i++){
		setOeuvre(artworks[i]);
	}
}

var setOeuvre = function(val){
	liste_oeuvres.push(val);
};

var setAnnotation = function(val){
	liste_annotations.push(val);
};

// Récupérer la liste des annotations d'une oeuvre
var getComments = function(art){
	var res = [];
	for (var i = 0; i < liste_annotations.length; i++) {
		if(liste_annotations[i].artwork == art){
			res.push(liste_annotations[i]);
		}
	};
	return res;
}

// Ajouter dans la base de données une annotation
var addComment = function(data){
	//TODO check si l'oeuvre existe dans la base
	liste_annotations.push(data);
	fs.writeFile("listeAnnotations.json", JSON.stringify(liste_annotations), function(err) {
	    if(err) {
	        console.info(err);
	    }

	    console.log("Annotation ajoutée avec succès!");
	}); 
}

/*******************************
			SERVER
*******************************/

app.use(cors());
app.options('*', cors());


// Obtenir la liste de toutes les oeuvres présentes dans la base de données
app.get("/api/oeuvres", function(req, res){
	console.log("Get oeuvres");
	res.type("application/json");
	res.json(liste_oeuvres);
});

// Obtenir le détail d'une oeuvre particulière
app.get("/api/oeuvre/:id", function(req, res){
	res.type("application/json");
	console.log("Get oeuvre id: "+req.params.id);
	var resp = liste_oeuvres[findIndexOf("id", req.params.id, liste_oeuvres)];
	res.json(resp);
});

// Obtenir la liste des commentaires d'une oeuvre
app.get("/api/comments/:artwork", function(req, res){
	console.log("Get comments artwork: "+ req.params.artwork);
	res.type("application/json");
	var resp = getComments(req.params.artwork);
	res.json(resp);
});

app.use(bodyParser.json());

//ne pas oublier de mettre le content-type - application/json

// Ajouter une annotation à une oeuvre
app.post("/api/comment", function(req, res){
	if (!req.body.hasOwnProperty('artwork') || !req.body.hasOwnProperty('comment')){
		res.statusCode = 400;

		return res.send("Error 400: Bad Input, artwork and comment required");
	}
	console.log(req.body);
	addComment(req.body);
	res.json({success:true}); 
});

var server = app.listen(4000, function(){
	console.log("Server ON");
});



