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

function seedUser() {
    console.log('seeding user data');
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync('123456', salt);
    let user = {
            username: 'james',
            password: hash,
        };      
    return User.create(user);
}

// GET TESTS
  describe('GET endpoint', function() {

    it('should get an object from db', function() {
      
      let res;
      return chai.request(app)
        .get('/')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200); 
          res.body.should.be.a('object');
        });
    });
});


// POST TESTS
  describe('POST endpoint', function() {

  it('should add an a game on POST', function() {
    const newItem = {gameName: '111', userName: '222'};
    return chai.request(app)
      .post('/favorites')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        //res.body.should.include.keys('userId', 'gameId');
      });
  });
});

  describe('POST endpoint', function() {

  it('should POST times to db', function() {
    const newItem = {gameName: '111', userName: '222', time: '00.00.00'};
    return chai.request(app)
      .post('/logs')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        //res.body.should.include.keys('userId', 'gameId');
      });
  });
});

  describe('testin login', function () {
 
    before(function () {
        return runServer();
    });

    beforeEach(function () {
        return seedUser();
    })

    afterEach(function () {
        return tearDownDB();
    });

    beforeEach(function () {
        return tester(app)
            .post('/users/login')
            .send({
                username: 'james',
                password: '123456',
            })
            .auth('james', '123456')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(function (res) {
                res.should.have.status(201);
            });
    });

    after(function () {
        return closeServer();
    });
});