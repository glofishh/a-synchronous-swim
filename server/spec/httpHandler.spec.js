
const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const server = require('./mockServer');
const queue = require('../js/messageQueue');
const multipart = require('../js/multipartUtils');

const httpHandler = require('../js/httpHandler');

describe('server responses', () => {

  it('should respond to a OPTIONS request', (done) => {
    let { req, res } = server.mock('/', 'OPTIONS');

    httpHandler.router(req, res);
    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
    expect(res._data.toString()).to.be.empty;

    done();
  });

  it('should respond to a GET request for a swim command', (done) => {
    const directions = ['up', 'down', 'left', 'right'];
    let { req, res } = server.mock('/moves', 'GET');

    queue.enqueue('up');
    httpHandler.router(req, res);
    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
    expect(directions).to.contain(res._data.toString());

    done();
  });

  it('should respond with 404 to a GET request for a missing background image', (done) => {
    let { req, res } = server.mock('/pita-chip.jpg', 'GET');

    httpHandler.router(req, res);
    expect(res._responseCode).to.equal(404);
    expect(res._ended).to.equal(true);
    done();
  });
  
  it('should respond with 200 to a GET request for a present background image', (done) => {
    let { backgroundImageFile } = httpHandler;
    let { req, res } = server.mock('/background.jpg', 'GET');
    
    httpHandler.router(req, res, () => {
      expect(res._responseCode).to.equal(200);
      expect(res._ended).to.equal(true);
      done();
    });
  });
  
  it('should respond to a POST request to save a background image', (done) => {
    fs.readFile('./spec/water-lg.multipart', (err, data) => {
      let { req, res } = server.mock('/background.jpg', 'POST', data);
      httpHandler.router(req, res, () => {
        expect(res._responseCode).to.equal(201);
        expect(res._ended).to.equal(true);
        done();
      });
    });
  });
  
  it('should send back the previously saved image', (done) => {
    fs.readFile('./spec/water-lg.multipart', (err, data) => {
      let post = server.mock('/background.jpg', 'POST', data);
      httpHandler.router(post.req, post.res, () => {
        let get = server.mock('/background.jpg', 'GET');
        httpHandler.router(get.req, get.res, () => {
          let file = multipart.getFile(data);
          expect(Buffer.compare(file.data, get.res._data)).to.equal(0);
          done();
        });
      });
    });
  });
});
