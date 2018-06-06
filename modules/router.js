var express = require('express');
const router = express();

var config = require('../config.js');

const OBA = require('oba-api');
const client = new OBA({
	public: config.obaAPI.public,
	secret: config.obaAPI.secret
});

router.set('view engine', 'ejs');
router.use(express.static(config.publicDir));
router.use(express.urlencoded());



// Requests with API
router.get('/', (req, res) => getTopTen(req, res));
router.get('/zoeken', (req, res) => search(req, res));
router.get('/details/:id', (req, res) => getBookDetails(req, res));
router.get('/api', (req, res) => {
	client.get('search', {
		q: "a",
		pagesize: 10,
		librarian: true,
	})
	.then(response => res.json(JSON.parse(response)))
	.catch(error => res.json(JSON.parse(error)))
});

// Requests without API
router.get('/mijnboeken', (req, res) => getMyBooks(req, res));

router.get('/leeslijst', (req, res) => getLeeslijst(req, res));

router.listen(config.server.port, () => console.log("Server started on port " + config.server.port));

function getTopTen(req, res) {
	client.get('search', {
		q: "q",
		pagesize: 3,
		librarian: true,
	})
	.then(response => res.render('index', {
		response: response
	}))
	.catch(error => res.render('index', {
		response: error
	}))
}

function search(req, res) {

	var q = ""

	if (typeof req.query.level != "undefined") {
		q = "classification:" + req.query.level + " " + req.query.q
	} else {
		q = req.query.q
	}

	client.get('search', {
		q: q,
		page: req.query.page,
		librarian: true,
		p: "jeugd",
		facet: 'Type(book)'
	})
		.then(response => res.render('zoeken', {
			response: response
		}))
		.catch(error => res.render('zoeken', {
			response: error
		}))
}

function getBookDetails(req, res) {
	client.get('details', {
		id: "|oba-catalogus|" + req.query.id,
	})
		.then(response => res.render('details', {
			response: response
		}))
		.catch(error => res.render('details', {
			response: error
		}))
}

function getAvailability(req, res) {
	client.get('availability', {
		id: "|oba-catalogus|" + req.query.id,
	})
		.then(response => res.send(response))
		.catch(error => res.send(error))
}

function getMyBooks(req, res) {
	// haal de boeken op
	res.render('mijnboeken')
}

// moet de username ophalen uit de database
function getUsername() {
	mysql.query('SELECT username FROM user', function (error, user) {
		user.content
	});
};

// maakt een nieuwe leeslijst
function createLeeslijst(username, naam){
	mysql.query (`INSERT (username, naam) INTO leeslijst , VALUES (${username}, ${naam}`);
	};

// functie voert een query uit op de datase om de boeken voor leeslijst '4' op te halen
function getLeeslijst(req, res) {
	router.mysql.query("SELECT idboek FROM `boek` WHERE leeslijst_id = '4'", function (err, result) {
		
		if (result)
		{
			var blaat = result.length;
			var leeslijst = [];
			result.forEach(function(boek){
				client.get('details', {
					id: "|oba-catalogus|" + boek.idboek,
					}).then(response => {
						let aquaObject = JSON.parse(response).aquabrowser;
						aquaObject.customDetailsUrl = '/details?id=' + boek.idboek;
						leeslijst.push(aquaObject);
						blaat--;
						if (blaat === 0)
							displayLeesLijst(res, leeslijst);
					}).catch(() => {blaat--; if (blaat === 0) displayLeesLijst(res, leeslijst)});
			});
		}
	});
}

function displayLeesLijst(res, leeslijst)
{
	leeslijst.sort(function(a, b)
	{
		if (a.titles.title.$t < b.titles.title.$t) return -1;
		return 1;
	});
	res.render('leeslijst', {leeslijst: leeslijst});
}

function voegToeAanLeeslijst(leeslijst, res){
	router.mysql.query("INSERT idboek, leeslijst_id INTO boek", function (err, result) {

	}
  
	)};

module.exports = router;

