const {ObjectID} = require('mongodb');
const mongoose = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo.js');

const id = '5b2d44e5b691136ec217359f';

if(!ObjectID.isValid(id)) {
    console.log(`ObjectID ${id} is not valid, exiting...`);
    return;
}

// Method : 1
Todo.find({ _id: id})
.then(doc => {
    console.log(doc);
}).catch(e => console.log(e));

//Method : 2
Todo.findById(id).then(doc => console.log(doc));

// Method : 3 (Preferred)
Todo.findOne({_id:id}).then(doc => console.log(doc));