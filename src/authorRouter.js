const AuthorModel = require('./AuthorModel');
const router = require('express').Router();

router.get('/', (req, res) => {
  AuthorModel.find()
    .then(author => {
      if (author.length > 0) res.status(200).json(author);
      else res.status(404).json({error: 'There is no quote.'});
    })
    .catch(err => res.status(500).json(err))
})

router.post('/add', (req, res, next) => {
  AuthorModel.findOne({name: {$regex: req.body.author, $options: 'i'}})
    .then(author => {
      if (author) return next();

      const newAuthor = new AuthorModel({
        name: req.body.author
      });

			newAuthor.quoteList.push({quote: req.body.quote});

      newAuthor.save()
        .then(author => res.status(200).json(author))
        .catch(err => res.status(500).json(err))
    })
    .catch(err => res.status(500).json(err))
}, (req, res) => {
  AuthorModel.findOneAndUpdate(
    {name: req.body.author},
    {$push: {quoteList: req.body.quote}},
    {new: true, upsert: true}
  )
    .then(author => res.status(200).json(author))
    .catch(err => res.status(500).json(err))
});

router.get('/:author', (req, res) => {
  AuthorModel.find({name: {$regex: req.params.author, $options: 'i'}})
    .then(author => {
      if (author.length > 0) res.status(200).json(author);
      else res.status(404).json({error: 'Author not found.'})
    })
    .catch(err => res.status(500).json(err))
});

router.patch('/remove', (req, res, next) => {
  AuthorModel.findOneAndUpdate(
    {_id: req.body.authorId},
    {$pull: {quoteList: req.body.quoteId}},
    {new: true}
  )
    .then(author => {
      if (author) {
				res.status(200);
				if (author.quoteList.length === 1) next();
			}
      else res.status(404).json({error: 'Author not found.'});
    })
    .catch(err => res.status(500).json(err))
}, (req, res) => {
	AuthorModel.findOneAndDelete({_id: req.body.authorId})
    .catch(err => res.status(500).json(err))
})

module.exports = router;