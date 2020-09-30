const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

require('dotenv').config();

const middlewares = require('./middlewares');

const app = express();

app.enable('trust proxy');

app.use(morgan('dev'));
app.use(helmet());
app.use(express.static(path.resolve('client/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('client/dist/index.html'));
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
