
const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const server = require('./mockServer');

const httpHandler = require('../js/httpHandler');
const enqueue = require('../js/messageQueue').enqueue;


describe('server responses', () => {

  it('should respond to a OPTIONS request', (done) => {
    let {req, res} = server.mock('/', 'OPTIONS');

    httpHandler.router(req, res);
    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
    expect(res._data.toString()).to.be.empty;

    done();
  });

  it('should respond to a GET request for a swim command', (done) => {
    const validMessages = ['left', 'right', 'up', 'down'];
    let {req, res} = server.mock('/', 'GET');
    enqueue('left');
    httpHandler.router(req, res, () => {
      expect(res._responseCode).to.equal(200);
      expect(res._ended).to.equal(true);
      expect(validMessages.includes(res._data.toString())).to.be.true;
      done();
    });
  });

  xit('should respond with 404 to a GET request for a missing background image', (done) => {
    httpHandler.backgroundImageFile = path.join('.', 'spec', 'missing.jpg');
    let {req, res} = server.mock('FILL_ME_IN', 'FILL_ME_IN');

    httpHandler.router(req, res, () => {
      expect(res._responseCode).to.equal(404);
      expect(res._ended).to.equal(true);
      done();
    });
  });

  xit('should respond with 200 to a GET request for a present background image', (done) => {
    // write your test here
    done();
  });

  xit('should respond to a POST request to save a background image', (done) => {
    // write your test here
    done();
  });

  xit('should send back the previously saved image', (done) => {
    // write your test here
    done();
  });
});
