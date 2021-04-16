const mongoose = require('mongoose');
const express = require('express');
const app = express();

const quotesRouter = require('./quotesRouter');

const port = 5555;
const url = 'mongodb://mongo:27017/quotes';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const mongodb = mongoose.connection;

mongodb.on('error', err => console.log(err) );
mongodb.once('open', () => console.log(`MongoDB Connected: ${url}`) )

app.use(express.json());
app.use('/', quotesRouter);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});