const router = require('express').Router();
const db = require('./index') 

router.get('/', (_, response) => {
  db.query(
    "SELECT * FROM quotes", [],
    (err, res) => {
      if (err) return response.send(err);
      response.status(200).json(res.rows)
    }
  )
});

router.get('/:author', (req, response) => {
  db.query(
    'SELECT * FROM quotes WHERE author_name = $1',
    [req.params.author],
    (err, res) => {
      if (err) return response.send(err);
      response.status(200).json(res.rows)
    }
  )
})

router.post('/', (req, response) => {
  db.query(
    `WITH etc AS (
      INSERT INTO author (name) VALUES ($1) ON CONFLICT DO NOTHING)
    INSERT INTO quotes (text, author_name) VALUES ($2, $1) RETURNING *`,
    [req.body.author, req.body.quote],
    (err, res) => {
      if (err) return response.send(err);
      response.status(200).json(res.rows)
    }
  )
});

router.delete('/:id', (req, response) => {
  console.log(req.params.id)
  db.query(
    "DELETE FROM quotes WHERE id = $1",
    [req.params.id],
    (err, res) => {
      if (err) return response.send(err);
      response.status(200).json({msg: "Quote deleted"});
    }
  )
})

module.exports = router;
