const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const dequeue = require('./messageQueue').dequeue;

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

module.exports.router = (req, res, next = () => { }) => {
  // const validMessages = ['left', 'right', 'up', 'down'];
  // let message = validMessages[Math.floor(Math.random() * 4)];
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  res.writeHead(200, headers);
  if (req.method === 'GET') {
    res.end(dequeue());
  } else {
    res.end();
  }
  next();
};
