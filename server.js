const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/cors');
const verifyJWT = require('./middleware/verifyJWT');
const connectDB = require('./config/mongodb');

require('dotenv').config();

const PORT = process.env.PORT ?? 3500;

connectDB();

const app = express();

// custom middleware logger.
app.use(logger);

// Handle options credentials check before CORS and fetch
app.use(credentials);

// Middleware.
app.use(cors(corsOptions));
// built-in middleware to handle url encoded data e.g. form data of type
// `content-type: applicaiton/x-www-form-urlencoded`.
app.use(express.urlencoded({ extended: false }));
// built-in middleware to handle json data.
app.use(express.json());
// built-in middleware to handle serving static files.
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(cookieParser());

// Routing.
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/refresh', require('./routes/api/token-refresh'));
app.use('/logout', require('./routes/api/logout'));

app.use(verifyJWT);
// app.use('/employees', verifyJWT, require('./routes/api/employees'));
app.use('/employees', require('./routes/api/employees'));

// Handle routes not found.
app.all('*', (req, res) => {
  res.status(404);

  if(req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if(req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});
app.use(errorHandler);

// Set API listening.
mongoose.connection.once('open', () => {
  console.log('Connected to MongDB');
  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
});
