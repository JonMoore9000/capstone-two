
// API KEY = EVTRaVwxMBmshYbIbSC2Oy6rVJXEp1z7GUtjsnbb96nCpQIVtT

var base_url = "https://igdbcom-internet-game-database-v1.p.mashape.com/games/";
var local = "http://localhost:8080/games";
var local_url = "https://immense-chamber-87502.herokuapp.com/games";

// Global state object for login
const state = {
    loggedIn: '',
    invalidLogin: false
};

// Get API DATA
function getData(callback, searchItem) {
	var query = {
		url: "/games",
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

// SAVING AND GETTING FAVORITE GAMES
function saveFavoriteData() {
	var query = {
		url: "/favorites",
		data: {
			"fields": "name, first_release_date",
		},
		type: 'POST',
		dataType: 'json',
	};
	$.ajax(query);
};

function getFavoriteData(callback) {
	var query = {
		url: "/favorites",
		data: {
			"fields": "id",
		},
		type: 'GET',
		dataType: 'json',
		success: callback
	};
	$.ajax(query);
};

//DISPLAY FAVORITE PAGE DATA
function displayFavoriteData(Results) {
	var Element = '';
	Element = Results.map(function(item) {
		//console.log(item.first_release_date);
		//console.log(Results)
    	var d = new Date(item.first_release_date*1000);
    	timeStamp = d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();

		return '<div class="eachOne">' +'<p class="name">' + item.name + '</p>' 
		+ '<p class="date">' + timeStamp + '</p>';
	});
	$('.js-results').html(Element);
};

// DISPLAY API DATA
function displayData(results) {
	var apiElement = '';
	apiElement = results.map(function(item) {
		//console.log(item.first_release_date);
		//console.log(apiResults)
    	var d = new Date(item.first_release_date*1000);
    	timeStamp = d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();

		//$('.favoritePage').on('click', '.eachOne', function() {
		//$(this).remove();
		//});

		return '<div class="eachOne" data-id="'+item.id+'">' +'<p class="name">' + item.name + '</p>' 
		+ '<p class="date">' + timeStamp + '</p>'
		+ '<button class="thing">Add</button>';
	});

	$('#js-results').html(apiElement);
};

function submitSearch() {
	$('.js-form').submit(function(event) {
		event.preventDefault();
		var query = $('.js-query').val();
		getData(displayData, query);
	});
}

function getMainPage() {
	$('.signUpPage').remove();
	$('.loginBox').remove();
	$('.logged-in').text(`Hello, ${state.loggedIn}`);
}

function getFavList() {
	$('.favListBtn').click(function(event) {
		event.preventDefault();
		getFavoriteData(displayFavoriteData);
		//$('.resultsPage').addClass('invisible');
		//$('.favoritePage').removeClass('invisible');
	});
}


function addToFavorite() {
	$('#js-results').on('click', '.thing', function() {
		var gameId = $(this).parent().data('id');
		//console.log(gameId);
		// post call goes here to save favorite games
		$.ajax({
            type: 'POST',
            url: '/favorites',
            data: {
                'fields':'id'
            },
        });
    });
}

function getSignUpPage() {
	$('.signUpBtn').click(function(event) {
		event.preventDefault();
		$('.resultsPage').addClass('invisible');
		$('.loginBox').addClass('invisible');
		$('.signUpPage').removeClass('invisible');
	});
}


// login listener
$('.loginForm').on('submit', function(e) {
    e.preventDefault();
    var username =  $('#username').val();
    var password = $('#password').val();
    loginUser(username, password);
});

// login user
function loginUser(username, password) {
    state.loggedIn = username;
    $.ajax({
            type: 'POST',
            url: '/users/login',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ":" + password),
                'Access-Control-Allow-Origin': '*',
            },
            'data': `{\"username\": \"${username}\",\n\t\"password\": \"${password}\"\n}`
        })
    .done(getMainPage())
    .fail(failedLogin());
}

$('.signUpForm').on('submit', function(e) {
	e.preventDefault();
	signUpUser();
});


//Post request on new user sign up
function signUpUser() {
	var newUsername = $('#newUsername').val();
	var newPassword = $('#newPassword').val();
    $.ajax({
            type: 'POST',
            url: '/users',
            'headers': {
                "content-type": "application/json",
                "cache-control": "no-cache",
            },
            'data': `{\"username\": \"${newUsername}\",\n\t\"password\": \"${newPassword}\"\n}`,
        })
        .done(function() {
            loginUser(newUsername, newPassword);
        })
        .fail(function() {
            failedLogin();
        })
}

function failedLogin () {  
    if (!state.invalidLogin) {
        var incorrectAlert = `<div class="incorrect">
        login failed</div>`
        $('.signUpBox').append(incorrectAlert);
        state.invalidLogin = true
    }
}

$(function(){
	addToFavorite();
	submitSearch();
	getFavList();
	getSignUpPage();
});