const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, fileName) => {
  const dateTime = `${format(new Date(), 'yyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', fileName), logItem);
  } catch(error) {
    console.error(error)
  }
};

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'middleware.log');
  next();
}
module.exports = { logger, logEvents };