const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const mongoose = require('mongoose');
const faker = require('faker');
const bcrypt = require('bcryptjs');
const tester = require('supertest-as-promised').agent;
const superagent = require('superagent');
const agent = superagent.agent();
const {app, runServer, closeServer} = require('../server');
const {User} = require('../users/index.js');

chai.use(chaiHttp);

// GET TEST
  describe('GET endpoint', function() {

    it('should get 200 status and HTML', function() {
      
      let res;
      return chai.request(app)
        .get('/games')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200); 
        });
     });
});

// Create random user

function generateName() {
    return faker.name.firstName();
}

function generateText() {
    return faker.lorem.paragraphs();
}

function generateDate() {
    return faker.date.past();
}

function generateNumber() {
    return faker.random.number();
}


function seedUser() {
    console.log('seeding user data');
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync('panda123', salt);
    let user = {
            username: 'disco',
            password: hash,
            project: 'panda'
        };      
    return User.create(user);
}

function tearDownDB() {
    return new Promise((resolve, reject) => {
        console.warn('delete database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}