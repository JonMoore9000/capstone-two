
// API KEY = EVTRaVwxMBmshYbIbSC2Oy6rVJXEp1z7GUtjsnbb96nCpQIVtT

base_url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/";

// Get API DATA
function getData(callback) {
	var query = {
		url: base_url,
		headers: {
			"X-Mashape-Key":"EVTRaVwxMBmshYbIbSC2Oy6rVJXEp1z7GUtjsnbb96nCpQIVtT",
			"Accept": "application/json"
		},
		data: {
			"fields": "name,first_release_date",
			"limit": 15,
		},
		type: 'GET',
		dataType: 'json',
		success: callback,
	};
	$.ajax(query);
};

// DISPLAY API DATA
function displayData(apiResults) {
	var apiElement = '';
	apiElement = apiResults.map(function(item) {
		console.log(apiResults);

    	var d = new Date(item.first_release_date*1000);
    	timeStamp = d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();

		return '<div class="eachOne">' +'<p class="name">' + item.name + '</p>' + '<p class="date">' + timeStamp + '</p>' + '</div>';
	});
	$('.js-results').html(apiElement);
};

function submitSearch() {
	$('.findResults').click(function(event) {
		event.preventDefault();
		getData(displayData);
	});
}


$(function(){
	submitSearch();
});