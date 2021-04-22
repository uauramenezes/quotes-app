const authorRouter = require('./authorRouter');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', authorRouter);

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

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});