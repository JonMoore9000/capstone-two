const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

const {app, runServer, closeServer} = require('../server');

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