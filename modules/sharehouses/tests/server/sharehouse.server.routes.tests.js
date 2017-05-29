'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sharehouse = mongoose.model('Sharehouse'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  sharehouse;

/**
 * Sharehouse routes tests
 */
describe('Sharehouse CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Sharehouse
    user.save(function () {
      sharehouse = {
        name: 'Sharehouse name'
      };

      done();
    });
  });

  it('should be able to save a Sharehouse if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Sharehouse
        agent.post('/api/sharehouses')
          .send(sharehouse)
          .expect(200)
          .end(function (sharehouseSaveErr, sharehouseSaveRes) {
            // Handle Sharehouse save error
            if (sharehouseSaveErr) {
              return done(sharehouseSaveErr);
            }

            // Get a list of Sharehouses
            agent.get('/api/sharehouses')
              .end(function (sharehousesGetErr, sharehousesGetRes) {
                // Handle Sharehouses save error
                if (sharehousesGetErr) {
                  return done(sharehousesGetErr);
                }

                // Get Sharehouses list
                var sharehouses = sharehousesGetRes.body;

                // Set assertions
                (sharehouses[0].user._id).should.equal(userId);
                (sharehouses[0].name).should.match('Sharehouse name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sharehouse if not logged in', function (done) {
    agent.post('/api/sharehouses')
      .send(sharehouse)
      .expect(403)
      .end(function (sharehouseSaveErr, sharehouseSaveRes) {
        // Call the assertion callback
        done(sharehouseSaveErr);
      });
  });

  it('should not be able to save an Sharehouse if no name is provided', function (done) {
    // Invalidate name field
    sharehouse.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Sharehouse
        agent.post('/api/sharehouses')
          .send(sharehouse)
          .expect(400)
          .end(function (sharehouseSaveErr, sharehouseSaveRes) {
            // Set message assertion
            (sharehouseSaveRes.body.message).should.match('Please fill Sharehouse name');

            // Handle Sharehouse save error
            done(sharehouseSaveErr);
          });
      });
  });

  it('should be able to update an Sharehouse if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Sharehouse
        agent.post('/api/sharehouses')
          .send(sharehouse)
          .expect(200)
          .end(function (sharehouseSaveErr, sharehouseSaveRes) {
            // Handle Sharehouse save error
            if (sharehouseSaveErr) {
              return done(sharehouseSaveErr);
            }

            // Update Sharehouse name
            sharehouse.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sharehouse
            agent.put('/api/sharehouses/' + sharehouseSaveRes.body._id)
              .send(sharehouse)
              .expect(200)
              .end(function (sharehouseUpdateErr, sharehouseUpdateRes) {
                // Handle Sharehouse update error
                if (sharehouseUpdateErr) {
                  return done(sharehouseUpdateErr);
                }

                // Set assertions
                (sharehouseUpdateRes.body._id).should.equal(sharehouseSaveRes.body._id);
                (sharehouseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sharehouses if not signed in', function (done) {
    // Create new Sharehouse model instance
    var sharehouseObj = new Sharehouse(sharehouse);

    // Save the sharehouse
    sharehouseObj.save(function () {
      // Request Sharehouses
      request(app).get('/api/sharehouses')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sharehouse if not signed in', function (done) {
    // Create new Sharehouse model instance
    var sharehouseObj = new Sharehouse(sharehouse);

    // Save the Sharehouse
    sharehouseObj.save(function () {
      request(app).get('/api/sharehouses/' + sharehouseObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', sharehouse.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sharehouse with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sharehouses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sharehouse is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sharehouse which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sharehouse
    request(app).get('/api/sharehouses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sharehouse with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sharehouse if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Sharehouse
        agent.post('/api/sharehouses')
          .send(sharehouse)
          .expect(200)
          .end(function (sharehouseSaveErr, sharehouseSaveRes) {
            // Handle Sharehouse save error
            if (sharehouseSaveErr) {
              return done(sharehouseSaveErr);
            }

            // Delete an existing Sharehouse
            agent.delete('/api/sharehouses/' + sharehouseSaveRes.body._id)
              .send(sharehouse)
              .expect(200)
              .end(function (sharehouseDeleteErr, sharehouseDeleteRes) {
                // Handle sharehouse error error
                if (sharehouseDeleteErr) {
                  return done(sharehouseDeleteErr);
                }

                // Set assertions
                (sharehouseDeleteRes.body._id).should.equal(sharehouseSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sharehouse if not signed in', function (done) {
    // Set Sharehouse user
    sharehouse.user = user;

    // Create new Sharehouse model instance
    var sharehouseObj = new Sharehouse(sharehouse);

    // Save the Sharehouse
    sharehouseObj.save(function () {
      // Try deleting Sharehouse
      request(app).delete('/api/sharehouses/' + sharehouseObj._id)
        .expect(403)
        .end(function (sharehouseDeleteErr, sharehouseDeleteRes) {
          // Set message assertion
          (sharehouseDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sharehouse error error
          done(sharehouseDeleteErr);
        });

    });
  });

  it('should be able to get a single Sharehouse that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Sharehouse
          agent.post('/api/sharehouses')
            .send(sharehouse)
            .expect(200)
            .end(function (sharehouseSaveErr, sharehouseSaveRes) {
              // Handle Sharehouse save error
              if (sharehouseSaveErr) {
                return done(sharehouseSaveErr);
              }

              // Set assertions on new Sharehouse
              (sharehouseSaveRes.body.name).should.equal(sharehouse.name);
              should.exist(sharehouseSaveRes.body.user);
              should.equal(sharehouseSaveRes.body.user._id, orphanId);

              // force the Sharehouse to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Sharehouse
                    agent.get('/api/sharehouses/' + sharehouseSaveRes.body._id)
                      .expect(200)
                      .end(function (sharehouseInfoErr, sharehouseInfoRes) {
                        // Handle Sharehouse error
                        if (sharehouseInfoErr) {
                          return done(sharehouseInfoErr);
                        }

                        // Set assertions
                        (sharehouseInfoRes.body._id).should.equal(sharehouseSaveRes.body._id);
                        (sharehouseInfoRes.body.name).should.equal(sharehouse.name);
                        should.equal(sharehouseInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Sharehouse.remove().exec(done);
    });
  });
});
