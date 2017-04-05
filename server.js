const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require('./users/models');
const favorite = require('./favorites/models');
const app = express();
const {router: usersRouter} = require('./users');
const {router: favRouter} = require('./favorites');
const {router: timeRouter} = require('./logs');
const {BasicStrategy} = require('passport-http');

mongoose.Promise = global.Promise;
app.use(bodyParser.json());

const {PORT, DATABASE_URL} = require('./config');

app.use('/favorites/', favRouter);
app.use('/users/', usersRouter);
app.use('/logs/', timeRouter);

app.use(express.static('public'));

app.use(morgan('common'));

app.get('/games', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(passport.initialize());
app.use(passport.session());

//passport authorization functions
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  User.findById(username, function(err, user) {
    done(err, user);
  });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post('/favorites', (req, res) => {
  console.log(res.body)
  res.json(res.body); 
});

app.get('/favorites', (req, res) => {
  console.log(res.body)
  res.json(res.body); 
});

let server;

function runServer() { 
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

function closeServer() {
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