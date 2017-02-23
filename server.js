var express = require('express');
const morgan = require('morgan');
const app = express();

const gamesRouter = require('./gamesRouter');
app.use('/favorites', gamesRouter);

app.use(express.static('public'));
app.listen(process.env.PORT || 8080);

app.use(morgan('common'));

app.get('/games', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// DIRECTS TO FAVORITES PAGE AND LOOKS FOR LOG IN
//app.get('/favorites', function (req, res) {
  //res.send('if you are viewing this page it means you are logged in');
//});

// CHECKS IF USER IS LOGGED IN
function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page, log in!');
  } else {
    next();
  }
}

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};