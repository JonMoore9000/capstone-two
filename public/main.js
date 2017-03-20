
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
//function getData(callback, searchItem) {
	//var query = {
		//url: '/games',
		//data: {
		//	"fields": "name",
		//	"limit": 15,
		//	"search": searchItem,
		//},
		//type: 'GET',
		//dataType: 'json',
		//success: callback,
	//};
	//$.ajax(query);
//};

// DISPLAY API DATA
//function displayData(results) {
	//console.log(results);
	//var apiElement = '';
	//apiElement = results.map(function(item) {
		//console.log(item.first_release_date);
		//console.log(data)
    	//var d = new Date(item.first_release_date*1000);
    	//timeStamp = d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();

		//return '<div class="eachOne" data-id="'+item.id+'">' +'<p class="name">' + item.name + '</p>' 
		//+ '<p class="date">' + timeStamp + '</p>'
		//+ '<button class="thing">Add</button>';
	//});
	//$('#js-results').html(apiElement);
//};

function addGame() {
	$('.js-form').submit(function(event) {
		event.preventDefault();
		//var gameName = $('.js-query').val();
		addGameToLogDB();
		alert('Your game was added!');
	});
}

function getMainPage() {
	$('.signUpPage').remove();
	$('.loginBox').remove();
	$('.logged-in').text(`Hello, ${state.loggedIn}`);
}

function getYourGames() {
	$('.yourGames').click(function(event) {
		event.preventDefault();
		getGamesFromDB(displayGames);
	});
}

function addGameToLogDB() {
	var name = $('.js-query').val();
	var user = state.loggedIn;
	$.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/favorites',
            'headers': {
                "content-type": "application/json",
            },
            'data': `{\"gameName\": \"${name}\",\n\t\"userName\": \"${user}\"\n}`,
    })
}

function getGamesFromDB(callback) {
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: '/favorites',
		'headers': {
			"content-type": "application/json",
		},
		'data': 'gameName, userName',
		success: callback,
	})
}

function displayGames(data) {
	user = state.loggedIn;
	var element = [];
	var thing = data.favorites;

		for (var i = 0; i < thing.length ; i++) {
    	if (thing[i].userName === user) {
        element.push(thing[i]);
    	}
	}
	 var result = element.map(function(item) {
		return '<div id="eachOne"><p>' + item.gameName + '</p></div>';
	});
	
		$('#js-games').html(result);
};


//function addToFavorite() {
	//$('#js-results').on('click', '.thing', function() {
		//var gameId = $(this).parent().data('id');
		//console.log(gameId);
		// post call goes here to save favorite games
    //});
//}

//function getSignUpPage() {
	//$('.signUpBtn').click(function(event) {
		//event.preventDefault();
		//$('.resultsPage').addClass('invisible');
		//$('.loginBox').addClass('invisible');
		//$('.signUpPage').removeClass('invisible');
	//});
//}


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
	//addToFavorite();
	addGame();
	getYourGames();
	//getSignUpPage();
});