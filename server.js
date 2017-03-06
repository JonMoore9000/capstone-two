const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require('./users/models');
const app = express();
const {router: usersRouter} = require('./users');
const {BasicStrategy} = require('passport-http');

mongoose.Promise = global.Promise;
app.use(bodyParser.json());

const {PORT, DATABASE_URL} = require('./config');

const gamesRouter = require('./gamesRouter');
app.use('/favorites', gamesRouter);

app.use(express.static('public'));
//app.listen(process.env.PORT || 8080);

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

app.use('/users/', usersRouter);

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