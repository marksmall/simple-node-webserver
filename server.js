const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const EventEmitter = require('events');

const logEvents = require('./logEvents');
const mimeTypes = require('./mime-types');

class Emitter extends EventEmitter {};

const serverEmitter = new Emitter();
serverEmitter.on ('log', (message, fileName) => logEvents(message, fileName));

const PORT = process.env.PORT ?? 3500;

const getContentType = (extension) => {
  let contentType = null;

  switch(extension) {
    case mimeTypes.CSS.extension:
      contentType = mimeTypes.CSS.type;
      break;
    case mimeTypes.JS.extension:
      contentType = mimeTypes.JS.type;
      break;
    case mimeTypes.JSON.extension:
      contentType = mimeTypes.JSON.type;
      break;
    case mimeTypes.JPG.extension:
      contentType = mimeTypes.JPG.type;
      break;
    case mimeTypes.PNG.extension:
      contentType = mimeTypes.PNG.type;
      break;
    case mimeTypes.TXT.extension:
      contentType = mimeTypes.TXT.type;
      break;
    default:
      contentType = mimeTypes.HTML.type;
  }

  return contentType;
}

const getPathToFile = (contentType, req) => {
  let filePath = null;
  if (contentType === mimeTypes.HTML.type && req.url === '/') {
    filePath = path.join(__dirname, 'views', 'index.html');
  } else {
    if (contentType === mimeTypes.HTML.type && req.url.slice(-1) === '/') {
      filePath = path.join(__dirname, 'views', req.url, 'index.html');
    } else {
      if (contentType === mimeTypes.HTML.type) {
        filePath = path.join(__dirname, 'views', req.url);
      } else {
        filePath = path.join(__dirname, req.url)
      }
    }
  }

  return filePath;
};

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(filePath, !contentType.includes('image') ? 'utf8' : '');
    const data = contentType === mimeTypes.JSON.type ? JSON.parse(rawData) : rawData;

    response.writeHead(
      filePath.includes('404.html') ? 404 : 200,
      { 'Content-Type': contentType });

      response.end(contentType === mimeTypes.JSON.type ? JSON.stringify(data) : data);
  } catch(error) {
    console.log(error);
    serverEmitter.emit('log', `${error.name}\t${error.message}`, 'error.log');
    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  serverEmitter.emit('log', `${req.url}\t${req.method}`, 'requests.log');

  const extension = path.extname(req.url);

  const contentType = getContentType(extension);
  let filePath = getPathToFile(contentType, req);

  // Makes .html extension not required in the browser.
  if (!extension && req.url.slice(-1) !== '/') {
    filePath += '.html'
  }

  const doesFileExist = fs.existsSync(filePath);
  if (doesFileExist) {
    // Serve the file
    serveFile(filePath, contentType, res);
  } else {
    //301 redirect
    switch(path.parse(filePath).base) {
      case 'old-page.html':
        res.writeHead(301, { 'Location': '/redirect-page.html'});
        res.end();
        break;
      case 'www-page.html':
        res.writeHead(301, { 'Location': '/'});
        res.end();
        break;
      default:
        // server 404 response.
        serveFile(path.join(__dirname, 'views', '404.html'), mimeTypes.HTML.type, res);
    }
  }
});

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));


// // Add listener for the log event.
// serverEmitter.on('log', (msg) => logEvents(msg));

// setTimeout(() => {
//   serverEmitter.emit('log', 'Log event emitted');
// }, 2000);
