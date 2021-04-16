const QuotesModel = require('./QuotesModel');
const router = require('express').Router();

router.post('/create', (req, res) => {
  QuotesModel.findOne({author: req.body.author})
    .then(collection => {
      if (collection) res.status(403).json({error: "Author already created"});
      else {
        let quote = req.body.quote.trim() ? [req.body.quote] : [];
        const newCollection = new QuotesModel({
          author: req.body.author,
          quotes: quote
        });
        newCollection.save()
          .then(collection => res.status(200).json(collection))
          .catch(err => res.status(500).json(err))
      }
    })
});

router.get('/', (req, res) => {
  QuotesModel.find()
    .then(collection => {
      if (collection.length > 0) res.status(200).json(collection);
      else res.status(404).json({error: 'There is no quotes'})
    })
    .catch(err => res.status(500).json(err))
})

router.get('/:author', (req, res) => {
  const author = req.params.author.replaceAll('+', ' ');
  QuotesModel.find({author: {$regex: author, $options: 'i'}})
    .then(collection => {
      if (collection.length > 0) res.status(200).json(collection);
      else res.status(404).json({error: 'Author not found'})
    })
    .catch(err => res.status(500).json(err))
});

router.put('/add', (req, res) => {
  QuotesModel.findOneAndUpdate(
    {author: req.body.author},
    {$push: {quotes: req.body.quote}},
    {new: true, upsert: true}
  )
    .then(collection => {
      if (collection.length > 0) res.status(200).json(collection  );
      else res.status(404).json({error: 'Author not found'})
    })
    .catch(err => res.status(500).json(err))
});

router.put('/update-author', (req, res) => {
  QuotesModel.findOneAndUpdate(
    {author: req.body.author},
    {author: req.body.newAuthor},
    {new: true}
  )
    .then(collection => {
      if (collection) res.status(200).json(collection);
      else res.status(404).json({error: 'Author not found'});
    })
    .catch(err => res.status(500).json(err))
})

router.put('/update-quote', (req, res) => {
  QuotesModel.findOneAndUpdate(
    {author: req.body.author, quotes: req.body.quote},
    {quotes: req.body.newQuote},
    {new: true}
  )
    .then(collection => {
      if (collection) res.status(200).json(collection);
      else res.status(404).json({error: 'Quote not found'});
    })
    .catch(err => res.status(500).json(err))
}, (req, res) => {
  QuotesModel.findOneAndUpdate(
    {author: req.body.author},
    {$push: {quotes: req.body.newQuote}},
    {new: true}
  )
    .then(collection => res.status(200).json(collection))
    .catch(err => res.status(500).json(err))
})

router.put('/remove', (req, res) => {
  QuotesModel.findOneAndUpdate(
    {author: req.body.author},
    {$pull: {quotes: req.body.quote}},
    {new: true}
  )
    .then(collection => {
      if (collection) res.status(200).json(collection);
      else res.status(404).json({error: 'Author not found'});
    })
    .catch(err => res.status(500).json(err))
})

router.delete('/:author', (req, res) => {
  const author = req.params.author.replaceAll('+', ' ');
  QuotesModel.findOneAndDelete({author: {$regex: author, $options: 'i'}})
    .then(collection => {
      if (collection) res.status(200).json(collection);
      else res.status(404).json({error: 'Author not found'});
    })
    .catch(err => res.status(500).json(err))
});

module.exports = router;