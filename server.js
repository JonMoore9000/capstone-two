var express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require('./users/models');
const app = express();
const {router: usersRouter} = require('./users');
const {BasicStrategy} = require('passport-http');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const gamesRouter = require('./gamesRouter');
app.use('/favorites', gamesRouter);

app.use(express.static('public'));
app.listen(process.env.PORT || 8080);

app.use(morgan('common'));

app.get('/games', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// DIRECTS TO FAVORITES PAGE AND LOOKS FOR LOG IN
app.get('/favorites', function (req, res) {
  res.alert('if you are viewing this page it means you are logged in');
});

// CHECKS IF USER IS LOGGED IN
function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.alert('You are not authorized to view this page, log in!');
  } else {
    next();
  }
}

const basicStrategy = new BasicStrategy(function(username, password, callback) {
  let user;
  User
    .findOne({username: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, {message: 'Incorrect username'});
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, {message: 'Incorrect password'});
      }
      else {
        return callback(null, user)
      }
    });
});

app.use('/users/', usersRouter);
passport.use(basicStrategy);

let server;

function runServer () { 
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(PORT, () => {
                console.log(`Your app is listening on port ${PORT}`);
                resolve();
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        })
        });
    };

function closeServer () {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
    });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};