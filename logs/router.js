const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuid = require('uuid');

router.use(jsonParser);

const time = require('./models');

router.get('/', (req, res) => {
  time
    .find()
    .exec()
    .then(times => {
      res.json({
        times: times.map(
          (time) => time)
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['gameName', 'userName', 'time'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = time.create(
    {gameName: req.body.gameName, userName: req.body.userName, time: req.body.time});
  res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
  favorites.delete(req.params.id);
  console.log(`Deleted games \`${req.params.ID}\``);
  res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'date', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating games \`${req.params.id}\``);
  const updatedItem = games.update({
    id: req.params.id,
    name: req.body.name,
    game: req.body.game
  });
  res.status(204).json(updatedItem);
});

module.exports = router;