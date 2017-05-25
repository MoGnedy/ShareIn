'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sharetool = mongoose.model('Sharetool'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  sharetool;

/**
 * Sharetool routes tests
 */
describe('Sharetool CRUD tests', function () {

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

    // Save a user to the test db and create new Sharetool
    user.save(function () {
      sharetool = {
        name: 'Sharetool name'
      };

      done();
    });
  });

  it('should be able to save a Sharetool if logged in', function (done) {
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

        // Save a new Sharetool
        agent.post('/api/sharetools')
          .send(sharetool)
          .expect(200)
          .end(function (sharetoolSaveErr, sharetoolSaveRes) {
            // Handle Sharetool save error
            if (sharetoolSaveErr) {
              return done(sharetoolSaveErr);
            }

            // Get a list of Sharetools
            agent.get('/api/sharetools')
              .end(function (sharetoolsGetErr, sharetoolsGetRes) {
                // Handle Sharetools save error
                if (sharetoolsGetErr) {
                  return done(sharetoolsGetErr);
                }

                // Get Sharetools list
                var sharetools = sharetoolsGetRes.body;

                // Set assertions
                (sharetools[0].user._id).should.equal(userId);
                (sharetools[0].name).should.match('Sharetool name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sharetool if not logged in', function (done) {
    agent.post('/api/sharetools')
      .send(sharetool)
      .expect(403)
      .end(function (sharetoolSaveErr, sharetoolSaveRes) {
        // Call the assertion callback
        done(sharetoolSaveErr);
      });
  });

  it('should not be able to save an Sharetool if no name is provided', function (done) {
    // Invalidate name field
    sharetool.name = '';

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

        // Save a new Sharetool
        agent.post('/api/sharetools')
          .send(sharetool)
          .expect(400)
          .end(function (sharetoolSaveErr, sharetoolSaveRes) {
            // Set message assertion
            (sharetoolSaveRes.body.message).should.match('Please fill Sharetool name');

            // Handle Sharetool save error
            done(sharetoolSaveErr);
          });
      });
  });

  it('should be able to update an Sharetool if signed in', function (done) {
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

        // Save a new Sharetool
        agent.post('/api/sharetools')
          .send(sharetool)
          .expect(200)
          .end(function (sharetoolSaveErr, sharetoolSaveRes) {
            // Handle Sharetool save error
            if (sharetoolSaveErr) {
              return done(sharetoolSaveErr);
            }

            // Update Sharetool name
            sharetool.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sharetool
            agent.put('/api/sharetools/' + sharetoolSaveRes.body._id)
              .send(sharetool)
              .expect(200)
              .end(function (sharetoolUpdateErr, sharetoolUpdateRes) {
                // Handle Sharetool update error
                if (sharetoolUpdateErr) {
                  return done(sharetoolUpdateErr);
                }

                // Set assertions
                (sharetoolUpdateRes.body._id).should.equal(sharetoolSaveRes.body._id);
                (sharetoolUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sharetools if not signed in', function (done) {
    // Create new Sharetool model instance
    var sharetoolObj = new Sharetool(sharetool);

    // Save the sharetool
    sharetoolObj.save(function () {
      // Request Sharetools
      request(app).get('/api/sharetools')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sharetool if not signed in', function (done) {
    // Create new Sharetool model instance
    var sharetoolObj = new Sharetool(sharetool);

    // Save the Sharetool
    sharetoolObj.save(function () {
      request(app).get('/api/sharetools/' + sharetoolObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', sharetool.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sharetool with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sharetools/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sharetool is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sharetool which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sharetool
    request(app).get('/api/sharetools/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sharetool with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sharetool if signed in', function (done) {
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

        // Save a new Sharetool
        agent.post('/api/sharetools')
          .send(sharetool)
          .expect(200)
          .end(function (sharetoolSaveErr, sharetoolSaveRes) {
            // Handle Sharetool save error
            if (sharetoolSaveErr) {
              return done(sharetoolSaveErr);
            }

            // Delete an existing Sharetool
            agent.delete('/api/sharetools/' + sharetoolSaveRes.body._id)
              .send(sharetool)
              .expect(200)
              .end(function (sharetoolDeleteErr, sharetoolDeleteRes) {
                // Handle sharetool error error
                if (sharetoolDeleteErr) {
                  return done(sharetoolDeleteErr);
                }

                // Set assertions
                (sharetoolDeleteRes.body._id).should.equal(sharetoolSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sharetool if not signed in', function (done) {
    // Set Sharetool user
    sharetool.user = user;

    // Create new Sharetool model instance
    var sharetoolObj = new Sharetool(sharetool);

    // Save the Sharetool
    sharetoolObj.save(function () {
      // Try deleting Sharetool
      request(app).delete('/api/sharetools/' + sharetoolObj._id)
        .expect(403)
        .end(function (sharetoolDeleteErr, sharetoolDeleteRes) {
          // Set message assertion
          (sharetoolDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sharetool error error
          done(sharetoolDeleteErr);
        });

    });
  });

  it('should be able to get a single Sharetool that has an orphaned user reference', function (done) {
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

          // Save a new Sharetool
          agent.post('/api/sharetools')
            .send(sharetool)
            .expect(200)
            .end(function (sharetoolSaveErr, sharetoolSaveRes) {
              // Handle Sharetool save error
              if (sharetoolSaveErr) {
                return done(sharetoolSaveErr);
              }

              // Set assertions on new Sharetool
              (sharetoolSaveRes.body.name).should.equal(sharetool.name);
              should.exist(sharetoolSaveRes.body.user);
              should.equal(sharetoolSaveRes.body.user._id, orphanId);

              // force the Sharetool to have an orphaned user reference
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

                    // Get the Sharetool
                    agent.get('/api/sharetools/' + sharetoolSaveRes.body._id)
                      .expect(200)
                      .end(function (sharetoolInfoErr, sharetoolInfoRes) {
                        // Handle Sharetool error
                        if (sharetoolInfoErr) {
                          return done(sharetoolInfoErr);
                        }

                        // Set assertions
                        (sharetoolInfoRes.body._id).should.equal(sharetoolSaveRes.body._id);
                        (sharetoolInfoRes.body.name).should.equal(sharetool.name);
                        should.equal(sharetoolInfoRes.body.user, undefined);

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
      Sharetool.remove().exec(done);
    });
  });
});
