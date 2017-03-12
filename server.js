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
const {BasicStrategy} = require('passport-http');
const request = require('superagent');

mongoose.Promise = global.Promise;
app.use(bodyParser.json());

const {PORT, DATABASE_URL} = require('./config');

app.use('/favorites/', favRouter);
app.use('/users/', usersRouter);

app.use(express.static('public'));
//app.listen(process.env.PORT || 8080);

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/games', (req, res) => {
request
  .get('https://igdbcom-internet-game-database-v1.p.mashape.com/games')
  .set('X-Mashape-Key', 'EVTRaVwxMBmshYbIbSC2Oy6rVJXEp1z7GUtjsnbb96nCpQIVtT')
  .set('Accept', 'application/json')
  .end(function(err, result) {
      res.json(result.body);
  });
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