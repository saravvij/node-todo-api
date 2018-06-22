const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const {User} = require('./models/User');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`Received new request path: ${req.path} body: ${req.body}`);
    next();
})

app.post('/todos', (req, res) => {
    const TodoDoc = new Todo(req.body);
    TodoDoc.save()
    .then( doc => res.status(201).send(doc))
    .catch( e =>  {
       // console.log("Unable create new Todo", e)
        res.status(400).send(`Error: Unable to create Todo. Details: ${e.message}`);
    });
});

app.get('/todos/:id', (req, res) => {
    Todo.findById(req.params.id)
    .then(doc => res.send(doc))
    .catch(err => res.send(err));
});

app.get('/todos', (req, res) => {
    Todo.find()
    .then(doc => res.send(doc))
    .catch(err => res.send(err));
});

app.put('/todos/:id', (req, res) => {
    Todo.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then( doc => res.status(200).send(doc))
    .catch(err => res.status(500).send(err));
});

app.delete('/todos/:id', (req, res) => {
    Todo.findOneAndRemove(req.params.id)
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(500).send(err));
});

app.listen(port, () => console.log(`Todo API service started and listening at port ${port}`));

module.exports = { app };