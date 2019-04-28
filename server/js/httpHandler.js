const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const queue = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

module.exports.router = (req, res, next = () => { }) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else if (req.method === 'GET') {
    if (req.url === '/moves') {
      res.writeHead(200, headers);
      res.end(queue.dequeue());
    } else if (req.url === '/background.jpg') {
      fs.readFile('./background.jpg', (err, data) => {
        if (err) {
          res.writeHead(404, headers);
          res.end()
        } else {
          res.writeHead(200, headers);
          res.write(data);
          res.end();
          next();
        }
      });
    } else {
      res.writeHead(404, headers);
      res.end();
    }
  } else if (req.method === 'POST') {
    if (req.url === '/background.jpg') {
      let imageData = Buffer.alloc(0);
      req.on('data', (part) => {
        imageData = Buffer.concat([imageData, part]);
      });
      req.on('end', () => {
        const file = multipart.getFile(imageData);
        fs.writeFile('./background.jpg', file.data, err => {
          if (err) {
            res.writeHead(400, headers);
            res.end()
          } else {
            res.writeHead(201, headers);
            res.end()
            next();
          }
        });
      });
    } else {
      res.writeHead(201, headers);
      res.end();
      next();
    }
  } else {
    res.writeHead(404, headers);
    res.end();
  }
};
