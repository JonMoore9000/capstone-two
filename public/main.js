
// API KEY = EVTRaVwxMBmshYbIbSC2Oy6rVJXEp1z7GUtjsnbb96nCpQIVtT

base_url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/";

// Get API DATA
function getData(callback, searchItem) {
	var query = {
		url: base_url,
		headers: {
			"X-Mashape-Key":"EVTRaVwxMBmshYbIbSC2Oy6rVJXEp1z7GUtjsnbb96nCpQIVtT",
			"Accept": "application/json"
		},
		data: {
			"fields": "name,first_release_date,cover",
			"limit": 15,
			"order": "release_dates.date:desc",
			"search": searchItem,
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
		//console.log(item.first_release_date);

    	var d = new Date(item.first_release_date*1000);
    	timeStamp = d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();

    	$('.js-results').on('click', '.eachOne', function() {
		$('ul').append(this);
		});

		$('.favoritePage').on('click', '.eachOne', function() {
		$(this).remove();
		});

		return '<div class="eachOne">' +'<p class="name">' + item.name + '</p>' 
		+ '<p class="date">' + timeStamp + '</p>';
	});
	$('.js-results').html(apiElement);
};

function submitSearch() {
	$('.js-form').submit(function(event) {
		event.preventDefault();
		var query = $('.js-query').val();
		getData(displayData, query);
	});
}

//function addToFavs() {
		//$(document).on('click', '#thing', function() {
		//console.log('it clicked');
		//$('ul').append('<li>' + item.name + '</li>');
		//});
//}

function getFavList() {
	$('.favListBtn').click(function(event) {
		event.preventDefault();
		console.log('list works');
		$('.resultsPage').addClass('invisible');
		$('.favoritePage').removeClass('invisible');
	});
}

function backToSearch() {
	$('.backToSearch').click(function(event) {
		event.preventDefault();
		$('.resultsPage').removeClass('invisible');
		$('.favoritePage').addClass('invisible');
	});
}


$(function(){
	submitSearch();
	//addToFavs();
	backToSearch();
	getFavList();
});