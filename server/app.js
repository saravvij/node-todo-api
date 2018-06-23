require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const {User} = require('./models/User');


const app = express();

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

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    const patchDoc = {};
    if(req.body.text) {
        patchDoc.text = req.body.text;
    }
    if(req.body.completed != undefined) {
        patchDoc.completed = req.body.completed;
    }

    patchDoc.completedAt = patchDoc.completed ? new Date().getTime() : null;

    Todo.findByIdAndUpdate(id, patchDoc, {new:true})
    .then( doc => {
        if(!doc || doc === null) {
            return res.status(404).send();
        }
        res.status(200).send(doc)
    })
    .catch(err => res.status(500).send(err));
});

app.delete('/todos/:id', (req, res) => {
    Todo.findOneAndRemove(req.params.id)
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(500).send(err));
});

app.listen(process.env.PORT, () => {
    console.log(`Todo API service started and listening at port ${process.env.PORT}`);
});

module.exports = { app };