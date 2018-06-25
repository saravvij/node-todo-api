const expect = require('expect');
const request = require('supertest');
const { Todo } = require('./models/Todo');
const { app } = require('./app');

describe('Todo APIs', () => {
  const text = 'Test create todo item';

  describe('POST /todos', () => {
    beforeEach((done) => {
      Todo.remove().then(() => done());
    });

    it('should create Todo', (done) => {
      request(app)
        .post('/todos')
        .send({ text })
        .expect(201)
        .expect((res) => {
          expect(res.body.text).toBe(text);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          Todo.find({})
            .then((todos) => {
              expect(todos[0].text).toBe(text);
              done();
            })
            .catch(err => done(err));
        });
    });

    it('should not create Todo', (done) => {
      request(app)
        .post('/todos')
        .send({ text: '' })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Todo.find({})
            .then((todos) => {
              expect(todos).toBeNull;
              done();
            }).catch(e => done(e));
        });
    });
  });

  describe('GET /todos', () => {
    let todoDocs = [];

    beforeEach((done) => {
      const todos = [{ text: 'The 1st todo' }, { text: 'The 2nd todo' }, { text: 'The 3rd todo' }];
      Todo.insertMany(todos)
        .then((docs) => {
          todoDocs = docs;
          done();
        }).catch(e => done(e));
    });

    afterEach(() => {
      todoDocs.forEach((doc) => {
        Todo.remove(doc);
      });
    });

    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(3);
        })
        .end(done);
    });

    it('should get todo by Id', (done) => {
      const testTodoId = todoDocs[0]._id;
      request(app)
        .get(`/todos/${testTodoId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toEqual(testTodoId);
        })
        .end(done);
    });
  });

  describe('PUT /todos', () => {
    let todoDocs = [];

    beforeEach((done) => {
      const todos = [{ text: 'The 1st todo' }];
      Todo.insertMany(todos)
        .then((docs) => {
          todoDocs = docs;
          done();
        }).catch(e => done(e));
    });

    afterEach((done) => {
      todoDocs.forEach((doc) => {
        Todo.remove(doc).then(() => done()).catch(e => done(e));
      });
    });

    it('should update todo by Id', (done) => {
      const testTodoId = todoDocs[0]._id;
      const updateText = 'Text updated';

      request(app)
        .put(`/todos/${testTodoId}`)
        .send({ text: updateText })
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          Todo.findById(testTodoId)
            .then((doc) => {
              expect(doc.text).toEqual(updateText);
              done();
            })
            .catch(e => done(e));
        });
    });
  });

  describe('DELEET /todos', () => {
    let todoDocs = [];

    beforeEach((done) => {
      const todos = [{ text: 'The 1st delete todo' }];
      Todo.insertMany(todos)
        .then((docs) => {
          todoDocs = docs;
          done();
        }).catch(e => done(e));
    });

    it('should delete todo by Id', (done) => {
      const todoId = todoDocs[0]._id;
      request(app)
        .delete(`/todos/${todoId}`)
        .expect(200)
        .end((err, res) => {
          if (res) {
            return done(err);
          }
          Todo.findById(todoId)
            .then((res) => {
              expect(res).toBeNull;
              done();
            }).catch(e => done(e));
        });
    });
  });
});
