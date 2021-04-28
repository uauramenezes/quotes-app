const router = require('express').Router();
const db = require('./index');

router.post('/', (req, response, next) => {
  db.query(
    'INSERT INTO author (name) VALUES ($1) ON CONFLICT DO NOTHING;',
    [req.body.author],
    (err) => {
      if (err) return response.send(err);
      next();
    }
  )
}, (req, response) => {
  db.query(
    `INSERT INTO quotes (text, author_id)
    SELECT DISTINCT $1, author_id FROM author
    WHERE author_id IN (SELECT author_id FROM author WHERE name = $2)
    RETURNING *;`,
    [req.body.quote, req.body.author],
    (err, res) => {
      if (err) return response.send(err);
      response.status(200).json(res.rows);
    }
  )
});

router.get('/', (_, response) => {
  db.query(
    `
    WITH a AS (SELECT * FROM author), q AS (SELECT * FROM quotes)
    SELECT * FROM a, q WHERE a.author_id = q.author_id
    ORDER BY a.name;
    `, [],
    (err, res) => {
      if (err) return response.send(err);
      response.status(200).json(res.rows);
    }
  )
});

router.get('/:author', (req, response) => {
  db.query(
    `
    SELECT * FROM author, quotes
    WHERE author.author_id = quotes.author_id
    AND author.name ILIKE $1;
    `,
    [req.params.author],
    (err, res) => {
      if (err) return response.send(err);
      response.status(200).json(res.rows);
    }
  )
})

router.delete('/:id', (req, response) => {
  db.query(
    "DELETE FROM quotes WHERE quote_id = $1",
    [req.params.id],
    (err, res) => {
      if (err) return response.send(err);
      response.status(200).json({msg: "Quote deleted"});
    }
  )
})

module.exports = router;
