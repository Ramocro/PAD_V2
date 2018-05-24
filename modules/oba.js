function search(q, page) {

	client.get('search', {
		q: q,
		page: page,
		librarian: true,
		p: "jeugd",
		facet: 'Type(book)'
	})
		.then(response => function(response){
		    return response;
		})
		.catch(error => function(error){
		    return error;
		})
}

function getBookDetails(req, res) {
	client.get('details', {
		id: "|oba-catalogus|" + req.params.id,
	})
		.then(response => res.send(response))
		.catch(error => res.send(error))
}

function getAvailability(req, res) {
	client.get('availability', {
		id: "|oba-catalogus|" + req.params.id,
	})
		.then(response => res.send(response))
		.catch(error => res.send(error))
}

function genSearch(response) {
	var html = "<!DOCTYPE html><html><head><title>Zoeken</title></head><body>";
	var object = JSON.parse(response);
	var data =  object.aquabrowser.results.result;

	data.forEach(function(item) {

		var title = "";
		if(item.titles.hasOwnProperty("short-title")){
		    title = item.titles["short-title"].$t;
		}else{
			title = item.titles.title.$t;
		}

		var img = "";
		if(item.coverimages.coverimage.hasOwnProperty(1)){
		    img = item.coverimages.coverimage[1].$t;
		}else{
			img = item.coverimages.coverimage.$t;
		}

		if(img.startsWith('/')){
			img = "https://zoeken.oba.nl" + img;
		}

		html += '<img style="max-height:100px;" src="' + img + '"><a href="/details/' + item.id.nativeid + '">' + title + '</a></br>';
	});

	html += '</body></html>'

	return html;
}

module.exports(search, search);