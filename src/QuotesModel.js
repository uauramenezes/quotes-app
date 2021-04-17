const mongoose = require('mongoose');

const QuotesSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    unique: true
  },
  quotes: [String]
});

const QuotesModel = mongoose.model('Quotes', QuotesSchema);

module.exports = QuotesModel;