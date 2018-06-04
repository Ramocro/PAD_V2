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

router.get('/leeslijst', (req, res) => getLeeslijst (req, res));

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
	client.get('search', {
		q: req.query.q,
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

function getLeeslijst(req, res) {
	res.render('leeslijst')
}
module.exports = router;