// implement your API here
const express = require('express');
const db = require('./data/db.js');
const server = express();

//Middleware
server.use(express.json());



//POST
server.post('/api/users', (req, res) => {
    const {name, bio} = req.body;
    console.log(req.body);
    if (!name || !bio) {
        res.status(400).json({error: "Please provide name and bio from the user"});
    } else {
    db.inset({name, bio})
    .then(({id}) => {
        db.findById(id)
        .then(user => {
        res.status(201).json(user);
    })
    .catch(err => {
        console.log('error', err);
        res.status(500).json({error: 'There was an error while saving the user to the database'});
        });
    })
    .catch(err => {
        console.log('error', err);
        res.status(500).json({error: "There was an error while saving the user to the database"});
        });
    }
});

//GET
server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        console.log('error', err);
        res.status(500).json({error: 'The users information could not be retrieved.'});
    });
});

//GET API/USERS/:ID
server.get('/api/users/:id', (req, res) => {
    const {id} = req.params;
    db.findById(id)
    .then(user => {
        console.log("user", user);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({error: "The user with the specified ID does not exist"});
        }
    })
    .catch(err => {
        console.log("error", err);
        res.status(500).json({error: "The user information could not be retrived"});
    });
});

//DELETE
server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;

    db.remove(id)
    .then(deleted => {
        console.log(deleted);
        if (deleted) {
            res.status(204).end();
        } else {
        res.status(404).json({error: "The user with the specified ID doesn't exist" });
        }
    })
        .catch(err => {
        console.log(err);
        res.status(500).json({error: "The user could not be removed"});
            });
    });

//PUT
server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;
    if (!name && !bio) {
      return res.status(400).json({error: 'Please provide name and bio for the user.'});
    }
    db.update(id, { name, bio })
      .then(updated => {
        if (updated) {
          db.findById(id)
            .then(user => res.status(200).json(user))
            .catch(err => {
              console.log(err);
              res.status(500).json({error: 'The user informatmion could not be retrieved.'});
            });
        } else {
          res.status(404).json({error: `The user with the specified ID does not exist.`});
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: 'The user information could not be modified.'});
      });
  });

//Server Listening
const port = 5000;
server.listen(port, () => console.log('API port 5000'));
