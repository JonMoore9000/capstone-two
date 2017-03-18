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

  describe('POST endpoint', function() {

  it('should add an item on POST', function() {
    const newItem = {userId: '111', gameId: '222'};
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