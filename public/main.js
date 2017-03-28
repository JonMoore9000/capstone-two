// Global state object for login
const state = {
    loggedIn: '',
    invalidLogin: false
};

function addGame() {
	$('.js-form').submit(function(event) {
		event.preventDefault();
		addGameToLogDB();
		alert('Your game was added!');
	});
}

function getMainPage() {
	state.invalidLogin = false;
	$('.signUpPage').remove();
	$('.loginBox').remove();
	$('.logged-in').text(`Hello, ${state.loggedIn}`);
	$('.timeTop').removeClass('invisible');
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
		return '<div class="eachOne"><p class="game">' + item.gameName + '</p>'
		+'<button class="startLog">Log</button>'
		+'</div>'
	});
	
		$('#js-games').html(result);
};

function chooseGame() {
	$('#js-games').on('click', '.startLog', function() {
		var game = '';
		game = $(this).parent().find('.game');
		$('.chosenGame').html(game.clone());
	});
}

function  timeKeeper() { 
	var h1 = $('#headTime')[0],
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

$('#js-games').on('click', '.startLog', function() {
		var game = '';
		game = $(this).parent().find('.game');
		//console.log(game);
		h1.textContent = "00.00.00";
    	seconds = 0; minutes = 0; hours = 0;
	});
};

function logTime() {
	$('#save').on('click', function() {
		logTimeToDb();
		alert('Your time was saved!')
	});
}

function logTimeToDb() {
	var user = state.loggedIn;
	var game = $('.chosenGame').text();
	var time = $('#headTime').text();
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
	//console.log(thing);

	var thing = data.times;
	for (var i = 0; i < thing.length ; i++) {
    if (thing[i].userName === user) {
    element.push(thing[i]);
  	}
  	console.log(element);
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

//console.log(str);
$('.yourTimesPage').html(result);

};

function timePage() {
	$('.yourTime').on('click', function() {
	$('.resultsPage').addClass('invisible');
	$('.yourTimesPage').removeClass('invisible');
	getTimesFromDB(displayTimes);;
	});
}

function homePage( ){
	$('.homePage').on('click', function() {
		$('.yourTimesPage').addClass('invisible');
		$('.resultsPage').removeClass('invisible');
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
            },
            'data': `{\"username\": \"${username}\",\n\t\"password\": \"${password}\"\n}`
     })
    .done(getMainPage)
    .fail(failed)
}

function signUp() {
	$('.signUpBtn').on('click', function() {
		$('.signUpPage').removeClass('invisible');
		$('.loginBox').addClass('invisible');
	});
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

function failed() {
	if (!state.invalidLogin) {
		alert('Login failed!');
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