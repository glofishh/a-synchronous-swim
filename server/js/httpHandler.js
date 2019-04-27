const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const dequeue = require('./messageQueue').dequeue;
const server = require('../spec/mockServer');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

module.exports.router = (req, res, next = () => { }) => {
  // const validMessages = ['left', 'right', 'up', 'down'];
  // let message = validMessages[Math.floor(Math.random() * 4)];
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  req.url = req.url.slice(0, req.url.length - 16); // gets rid of the stuff we don't understand
  let extension = req.url.slice(req.url.length - 4, req.url.length); // selects file extnsion
  if (extension === '.jpg' && req.method === 'GET') { // trying to get an img
    console.log(req.url);
    // if (fs.existsSync(req.url)) { // TODO send back existing img
    // retrieve the image from the url
    // convert the image data to binary (multipart?)
    // write the binary data to a buffer ---> res.write
    // stream the buffer back to the client? ---> createReadStream, pipe?
    let imagePath = path.join(__dirname, req.url);
    let fileStream = fs.createReadStream(imagePath);
    res.writeHead(200, headers);
    fileStream.pipe(res);
    console.log('HEY WE GOT HERE')
    // fs.readFile(req.url, (err, data) => {
    //   //   res.end();
    // });
    // } else { // image not found
    // res.writeHead(404, headers);
    // res.end();
    // }
    res.end()
  } else if (req.method === 'GET') { // swim command
    res.writeHead(200, headers);
    res.end(dequeue());
  } else if (req.method === 'POST') { // TODO upload background image

  } else { // options
    res.writeHead(200, headers);
    res.end();
  }
  next();
};
