const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

// mongo here...
const mongoose = require('mongoose')
const mongoDB = 'mongodb+srv://AE8891:asdasdasd@fullstack.9svpw.mongodb.net/?retryWrites=true&w=majority&appName=Fullstack'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log("Database test connected")
})

// schema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true }
})

// model
const Todo = mongoose.model('Todo', todoSchema, 'todos') // last 'todos' creates new document called todos

// routes

// POST
app.post('/todos', async (request, response) => {
    const { text } = request.body
    const todo = new Todo({
        text: text
    })
    const savedTodo = await todo.save()
    response.json(savedTodo)
})

// GET
app.get('/todos', async (request, response) => {
    const todos = await Todo.find({})
    response.json(todos)
})

// GET id
app.get('/todos/:id', async (request, response) => {
    const todo = await Todo.findById(request.params.id)
    if (todo) response.json(todo)
    else response.status(404).end()
})

// DELETE
app.delete('/todos/:id', async (request, response) => {
    const doc = await Todo.findById(request.params.id);
    if (doc) {
        await doc.deleteOne()
        response.json(doc)
    }
    else response.status(404).end()
})

// PUT
app.put('/todos/:id', async (request, response) => {
    const updatedDoc = await Todo.findByIdAndUpdate(
        request.params.id,
        request.body,
        { new: true}
    )
    if (updatedDoc) {
        response.json(updatedDoc)
    } else {
        response.status(404).end()
    }
})

/* // todos-route
app.get('/todos', (request, response) => {
    response.send('Todos')
}) */

// app listen port 3000
app.listen(port, () => {
    console.log('Example app listening on port 3000')
})