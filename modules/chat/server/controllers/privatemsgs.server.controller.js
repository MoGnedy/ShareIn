'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  // privatMsg = mongoose.model('privatMsg'),
  _PrivatMsg = mongoose.model('PrivatMsg'),
  _User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a privatMsg
 */
exports.create = function(req, res) {
  console.log("Chat server.create");

  _PrivatMsg.find({
    user: req.user
  }).exec(function(err, obj) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log("------------ Private User Object -----------------");
      console.log(obj);
      if (obj.length) {
        // if it is not the first message
        console.log(obj);
        _PrivatMsg.find({
          user: req.user,
          allMessages: {
            $elemMatch: {
              user: req.body.receiver
            }
          }
        }).exec(function(err, obj) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            console.log("------------ Private messages array -----------------");
            console.log('user : ', obj);
            // console.log(req.body.receiver);
            console.log('---------------------------');
            // console.log(req.user);
            console.log('------------------------------');
            if (obj.length) {
              console.log('receiver : ', req.body.receiver);
              console.log('sender : ', req.user);
              var pushedMessage = _PrivatMsg.findOneAndUpdate({
                user: req.user,
                allMessages: {
                  $elemMatch: {
                    user: req.body.receiver
                  }
                }
              }, {
                $push: {
                  'allMessages.$.messages': {
                    'user': req.user,
                    'message': req.body.private_message
                  }
                }
              }).exec(function(err, object) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  console.log('success');
                  console.log(object);
                  console.log(pushedMessage);



                  //Save to another user
                  _PrivatMsg.find({
                    user: req.body.receiver
                  }).exec(function(err, recObj) {
                    if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {
                      console.log("++++++++++++++++++++++++++++++++");
                      console.log(recObj);
                      console.log(recObj.length);
                      if (recObj.length) {
                        _PrivatMsg.find({
                          user: req.body.receiver,
                          allMessages: {
                            $elemMatch: {
                              user: req.user
                            }
                          }
                        }).exec(function(err, resObj) {
                          if (err) {
                            return res.status(400).send({
                              message: errorHandler.getErrorMessage(err)
                            });
                          } else {
                            console.log("+++++++++++++++++++ save ++++++++++++++++");
                            if (resObj.length) {

                              _PrivatMsg.findOneAndUpdate({
                                user: req.body.receiver,
                                allMessages: {
                                  $elemMatch: {
                                    user: req.user
                                  }
                                }
                              }, {
                                $set: {
                                  'allMessages.$.updated': new Date().toISOString()
                                },
                                $push: {
                                  'allMessages.$.messages': {
                                    'user': req.user,
                                    'message': req.body.private_message
                                  }
                                }
                              }).exec(function(err, resObj) {
                                if (err) {
                                  return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                  });
                                } else {
                                  console.log("+++++++++++++++++ Object ++++++++++++");
                                  console.log(resObj);
                                  console.log('success');



                                }
                              });


                            } else {

                              _PrivatMsg.findOneAndUpdate({
                                "user": req.body.receiver
                              }, {
                                $push: {
                                  'allMessages': {
                                    'user': req.user,
                                    'messages': [{
                                      'user': req.user,
                                      'message': req.body.private_message
                                    }]
                                  }
                                }
                              }).exec(function(err, object) {
                                if (err) {
                                  return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                  });
                                } else {
                                  console.log('success');
                                }
                              });


                            }
                          }
                        });



                      } else {

                        var recPrivatMsg = new _PrivatMsg();
                        recPrivatMsg.user = req.body.receiver;
                        var allmessages = {
                          'user': req.user,
                          'messages': [{
                            'user': req.user,
                            'message': req.body.private_message
                          }]
                        };
                        recPrivatMsg.allMessages.push(allmessages);
                        recPrivatMsg.save(function(err) {
                          if (err) {
                            return res.status(400).send({
                              message: errorHandler.getErrorMessage(err)
                            });
                          } else {
                            console.log(recPrivatMsg);

                          }
                        });



                      }


                    }
                  });









                  res.jsonp(pushedMessage);

                }
              });
              console.log(obj);
              // obj[0].allMessages.push(message);
              // obj.save();
            } else {

              console.log("notFound 222");

              var newPushedMessage = _PrivatMsg.findOneAndUpdate({
                user: req.user
              }, {
                $push: {
                  'allMessages': {
                    'user': req.body.receiver,
                    'messages': [{
                      'user': req.user,
                      'message': req.body.private_message
                    }]
                  }
                }
              }).exec(function(err, object) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  console.log('success');
                  console.log(object);
                  res.jsonp(newPushedMessage);

                }
              });



            }
          }
        });


      } else {
        // if it is the first message
        console.log("notFound");
        var privatMsg = new _PrivatMsg();
        privatMsg.user = req.user;
        var allmessages = {
          'user': req.body.receiver,
          'messages': [{
            'user': req.user,
            'message': req.body.private_message
          }]
        };
        privatMsg.allMessages.push(allmessages);
        privatMsg.save(function(err) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            console.log(privatMsg);


            console.log("+++++++++++++++++++++++++ Save msg to the other user ++++++++++++++++++++++");




            //Save to another user
            _PrivatMsg.find({
              user: req.body.receiver
            }).exec(function(err, recObj) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                console.log("++++++++++++++++++++++++++++++++");
                console.log(recObj);
                console.log(recObj.length);
                if (recObj.length) {
                  _PrivatMsg.find({
                    user: req.body.receiver,
                    allMessages: {
                      $elemMatch: {
                        user: req.user
                      }
                    }
                  }).exec(function(err, resObj) {
                    if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {
                      console.log("+++++++++++++++++++ save ++++++++++++++++");
                      if (resObj.length) {

                        _PrivatMsg.findOneAndUpdate({
                          user: req.body.receiver,
                          allMessages: {
                            $elemMatch: {
                              user: req.user
                            }
                          }
                        }, {
                          $push: {
                            'allMessages.$.messages': {
                              'user': req.user,
                              'message': req.body.private_message
                            }
                          }
                        }).exec(function(err, resObj) {
                          if (err) {
                            return res.status(400).send({
                              message: errorHandler.getErrorMessage(err)
                            });
                          } else {
                            console.log("+++++++++++++++++ Object ++++++++++++");
                            console.log(resObj);
                            console.log('success');



                          }
                        });


                      } else {

                        _PrivatMsg.findOneAndUpdate({
                          "user": req.body.receiver
                        }, {
                          $push: {
                            'allMessages': {
                              'user': req.user,
                              'messages': [{
                                'user': req.user,
                                'message': req.body.private_message
                              }]
                            }
                          }
                        }).exec(function(err, object) {
                          if (err) {
                            return res.status(400).send({
                              message: errorHandler.getErrorMessage(err)
                            });
                          } else {
                            console.log('success');
                          }
                        });


                      }
                    }
                  });



                } else {

                  var recPrivatMsg = new _PrivatMsg();
                  recPrivatMsg.user = req.body.receiver;
                  var allmessages = {
                    'user': req.user,
                    'messages': [{
                      'user': req.user,
                      'message': req.body.private_message
                    }]
                  };
                  recPrivatMsg.allMessages.push(allmessages);
                  recPrivatMsg.save(function(err) {
                    if (err) {
                      return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    } else {
                      console.log(recPrivatMsg);

                    }
                  });



                }


              }
            });






            res.jsonp(privatMsg);
          }
        });






      }
    }
  });


};

/**
 * Show the current privatMsg
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var privatMsg = req.privatMsg ? req.privatMsg.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  privatMsg.isCurrentUserOwner = req.user && privatMsg.user && privatMsg.user._id.toString() === req.user._id.toString();

  res.jsonp(privatMsg);
};

/**
 * Update a privatMsg
 */
exports.update = function(req, res) {
  var privatMsg = req.privatMsg;

  privatMsg = _.extend(privatMsg, req.body);

  privatMsg.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(privatMsg);
    }
  });
};

/**
 * Delete an privatMsg
 */
exports.delete = function(req, res) {
  var privatMsg = req.privatMsg;

  privatMsg.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(privatMsg);
    }
  });
};

/**
 * List of privatMsgs
 */
exports.list = function(req, res) {
  console.log('------------------list----------------------------');
  console.log(req.body);
  if (req.body) {
    _PrivatMsg.findOne({
      user: req.user
    }, {
      allMessages: {
        $elemMatch: {
          user: req.body
        }
      }

    }).populate('allMessages.messages.user').exec(function(err, privatMsgs) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log("------------ Private messages -----------------");
        console.log(privatMsgs);

        res.jsonp(privatMsgs);
      }
    });
  }
};

exports.getPrivateUser = function(req, res) {
  console.log('----------------------------------------------');
  console.log(req.body);
  if (req.body.id) {
    _User.find({
      '_id': req.body.id
    }).exec(function(err, user) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log("------------ Private User messages -----------------");
        console.log(user[0]);
        console.log(user[0].password);
        delete user[0].password;
        delete user[0].salt;
        console.log(user[0]);
        res.jsonp(user[0]);
      }
    });
  }
};

exports.getConvsMsgs = function(req, res) {

  _PrivatMsg.find({
    user: req.user
  }).populate('allMessages.user').populate('allMessages.messages.user').exec(function(err, resData) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var latesMsgs = [];
      // console.log(resData);
      if (resData && resData[0] && resData[0].allMessages) {
        var msgsArray = resData[0].allMessages;
        console.log(msgsArray);

        console.log(msgsArray.length);
        for (var i = 0; i < msgsArray.length; i++) {
          delete msgsArray[i].user.password;
          delete msgsArray[i].user.salt;
          latesMsgs.push({
            'convWith': msgsArray[i].user,
            'msgData': msgsArray[i].messages[msgsArray[i].messages.length - 1]
          });
          console.log('==========================================');
          console.log(i);
          console.log(latesMsgs);
        }
        latesMsgs.sort(function(a, b) {
          var keyA = new Date(a.created),
            keyB = new Date(b.created);
          // Compare the 2 dates
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        });
        console.log(latesMsgs);
      } else {
        console.log("no Convs");
      }
      res.jsonp(latesMsgs);

    }
  });
};






exports.removeConv = function(req, res) {
  console.log('------------------list----------------------------');
  if (req.body) {
    var removedConv = _PrivatMsg.update({
        user: req.user
      }, {
        $pull: {
          allMessages: {
            user: req.body._id
          }
        }
      }
      // {$pull: { allMessages.$.user: req.body }}


    ).exec(function(err, privatMsgs) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log("------------ Private messages -----------------");
        console.log(removedConv);
        res.jsonp(1);
      }
    });
  }
};



exports.removeMsg = function(req, res) {
  console.log('------------------list----------------------------');
  console.log(req.body.user);
  if (req.body) {
    var removedMsg = _PrivatMsg.update({
        user: req.user
      }, {
        $pull: {
          "allMessages.0.messages": {
            "_id": req.body._id
          }
        }
      }

    ).exec(function(err, privatMsgs) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log("------------ Private messages -----------------");
        console.log(removedMsg);

        res.jsonp(1);
      }
    });
  }
};







/**
 * privatMsg middleware
 */
exports.privatMsgByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'privatMsg is invalid'
    });
  }

  _PrivatMsg.findById(id).populate('user', 'displayName').exec(function(err, privatMsg) {
    if (err) {
      return next(err);
    } else if (!privatMsg) {
      return res.status(404).send({
        message: 'No privatMsg with that identifier has been found'
      });
    }
    req.privatMsg = privatMsg;
    next();
  });






};
