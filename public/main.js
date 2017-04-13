// Global state object for login
const state = {
    loggedIn: '',
    invalidLogin: false
};

function addGame() {
	$('.js-form').on('submit', function(event) {
		event.preventDefault();
		var game = $('.js-query').val();

		if(state.loggedIn.length && game.length >= 1) {
			addGameToLogDB();
			$('.your-times-page').addClass('invisible');
			$('.results-page').removeClass('invisible');
			getGamesFromDB(displayGames);

			var added = 'Your game was added!';
			$('.js-type-game').html(added);
			setTimeout(function() {
    			$('.js-type-game').fadeOut(added).html('').fadeIn();
			}, 2000);
		}

		if(!game.length) {
			var type = 'Gotta type something!';
			$('.js-type-game').html(type);
			setTimeout(function() {
    			$('.js-type-game').fadeOut(type).html('').fadeIn();
			}, 2000);
		}
	});
}

function deleteGame() {
	$('#delete').on('click', function() {
		removeGame();
		var gone = 'Your time was deleted!';
		$('.js-type-game').html(gone);
		setTimeout(function() {
    			$('.js-type-game').fadeOut(gone).html('').fadeIn();
			}, 2000);
	}
}

function removeGame() {
	$.ajax({
		type: 'DELETE',
		dataType: 'json',
		url: '/favorites',
	})
}

function getMainPage() {
	state.invalidLogin = false;
	$('.sign-up-page').remove();
	$('.login-box').remove();
	$('.logged-in').text(`Hello, ${state.loggedIn}`);
	$('.opening').addClass('invisible');
	$('.time-top').removeClass('invisible');
	$('.controls').removeClass('invisible');
	$('.results-page').removeClass('invisible');
}

function getYourGames() {
	$('.your-games').click(function(event) {
		$('.your-times-page').addClass('invisible');
		$('.results-page').removeClass('invisible');
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
		return '<div class="each-one"><p class="game">' + item.gameName + '</p>'
		+'<button class="start-log">Log</button>'
		+'</div>'
	});
	
		$('#js-games').html(result);
};

function chooseGame() {
	$('#js-games').on('click', '.start-log', function() {
		var game = '';
		game = $(this).parent().find('.game');
		$('.chosen-game').html(game.clone());
	});
}

function  timeKeeper() { 
	var h1 = $('#head-time')[0],
    start = $('#start'),
    stop = $('#stop'),
    clear = $('#clear'),
    seconds = 0, minutes = 0, hours = 0,
    t;

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) :
     "00") + "." + (minutes ? (minutes > 9 ? minutes : "0" + minutes) :
      "00") + "." + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}

/* Start button */
$('#start').on('click', function() {
	clearTimeout(t);
	timer();
});

/* Stop button */
$('#stop').on('click', function() {
    clearTimeout(t);
});

/* Clear button */
$('#clear').on('click', function() {
    h1.textContent = "00.00.00";
    seconds = 0; minutes = 0; hours = 0;
});

$('#js-games').on('click', '.start-log', function() {
		var game = '';
		game = $(this).parent().find('.game');
		h1.textContent = "00.00.00";
    	seconds = 0; minutes = 0; hours = 0;
	});
};

function logTime() {
	$('#save').on('click', function() {
		logTimeToDb();
		var saves = 'Your time was saved!';
		$('.js-type-game').html(saves);
		setTimeout(function() {
    			$('.js-type-game').fadeOut(saves).html('').fadeIn();
			}, 2000);
	});
}

function logTimeToDb() {
	var user = state.loggedIn;
	var game = $('.chosen-game').text();
	var time = $('#head-time').text();
	$.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/logs',
            'headers': {
                "content-type": "application/json",
            },
            'data': `{\"gameName\": \"${game}\",\n\t\"userName\": \"${user}\",\n\t\"time\":\"${time}\"}`,
    })
}

function getTimesFromDB(callback) {
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: '/logs',
		'headers': {
			"content-type": "application/json",
		},
		'data': 'gameName, userName, time',
		success: callback,
	})
}

function displayTimes(data) {
	user = state.loggedIn;
	var element = [];

	var thing = data.times;
	for (var i = 0; i < thing.length ; i++) {
    if (thing[i].userName === user) {
    element.push(thing[i]);
  	}
  }


var times = _.groupBy(element, "gameName");
let game_times = {};
for(key in times){
  game_times[key] = _.reduce(times[key], (sum, time)=> {
    time = time.time.split(".");
    sum = sum.split(".");
    let total = "";
    let ss = parseInt(sum[2]) + parseInt(time[2]);
    let mm = parseInt(sum[1]) + parseInt(time[1]);
    let hh = parseInt(sum[0]) + parseInt(time[0]);
    mm += parseInt(ss / 60);
    hh += parseInt(mm / 60);
    ss = ss % 60;
    return hh + "." + mm + "." + ss + '<br>';
  },"00.00.00");
  str = JSON.stringify(game_times, null, 4);
  var final = str.replace(/"/g, '');
  var final1 = final.replace(/{/g, '');
  var final2 = final1.replace(/}/g, '');
  var result = final2.replace(/,/g, '');
}

$('.your-times-page').html(result);

};

function timePage() {
	$('.your-time').on('click', function() {
	$('.results-page').addClass('invisible');
	$('.your-times-page').removeClass('invisible');
	getTimesFromDB(displayTimes);;
	});
}

function homePage( ){
	$('.home-page').on('click', function() {
		$('.your-times-page').addClass('invisible');
		$('.results-page').removeClass('invisible');
	});
}


// login listener
$('.login-form').on('submit', function(e) {
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
            },
            'data': `{\"username\": \"${username}\",\n\t\"password\": \"${password}\"\n}`
     })
    .done(getMainPage)
    .fail(failed)
}

function signUp() {
	$('.sign-up-btn').on('click', function() {
		$('.sign-up-page').removeClass('invisible');
		$('.login-box').addClass('invisible');
	});
}

$('.sign-up-form').on('submit', function(e) {
	e.preventDefault();
	signUpUser();
});


//Post request on new user sign up
function signUpUser() {
	var newUsername = $('#new-username').val();
	var newPassword = $('#new-password').val();
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

function failed() {
	if (!state.invalidLogin) {
		var words= 'Login failed!';
		$('.js-login-fail').html(words);
		state.invalidLogin = true;
	}
}


function failedLogin () {  
    if (!state.invalidLogin) {
        var incorrectAlert = `<p class="incorrect">
        Login failed</p>`
        $('.signUpBox').append(incorrectAlert);
        state.invalidLogin = true
    }
}

$(function(){
	chooseGame();
	addGame();
	signUp();
	getYourGames();
	homePage();
	timeKeeper();
	logTime();
	timePage();
});