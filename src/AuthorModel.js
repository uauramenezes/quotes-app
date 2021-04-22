const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
	quote: String
})

const AuthorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quoteList: [QuoteSchema]
});

const AuthorModel = mongoose.model('Quotes', AuthorSchema);

module.exports = AuthorModel;