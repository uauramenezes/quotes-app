const router = require('express').Router();
const db = require('./index') 

router.get('/', (_, response) => {
  db.query(
    "SELECT * FROM users", [],
    (err, res) => {
      if (err) response.send(err);
      response.status(200).json(res.rows)
    }
  )
});

router.get('/:name', (req, response) => {
  db.query(
    "SELECT name FROM users WHERE name = $1",
    [req.params.name],
    (err, res) => {
      if (err) response.send(err);
      response.status(200).json(res.rows)
    }
  )
})

router.post('/', (req, response) => {
  db.query(
    "INSERT INTO users (name) VALUES ($1) RETURNING *;",
    [req.body.name],
    (err, res) => {
      if (err) response.send(err);
      response.status(200).json(res.rows)
    }
  )
});

router.delete('/:name', (req, response) => {
  db.query(
    "DELETE FROM users WHERE name = $1",
    [req.params.name],
    (err, res) => {
      if (err) response.send(err);
      response.status(200).json(res.rows)
    }
  )
})

module.exports = router;