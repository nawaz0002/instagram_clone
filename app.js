const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGOURI } = require('./config/keys');
const cors = require('cors')
const PORT = process.env.PORT || 8000;

// routes
const authRoute = require('./route/auth');
const postRoute = require('./route/post');
const otherProfileRoute = require('./route/otherProfile');

// model
const User = require('./model/user')

// database connection
mongoose.connect(MONGOURI, { useUnifiedTopology: true, useNewUrlParser: true})
mongoose.connection.on('connected', () => {
    console.log('connected to db');
})
mongoose.connection.on('error', () => {
    console.log('error connecting');
})

app.use(cors());

// middlewares
app.use(express.json());

const customMiddleware = (req, res, next) => {
    console.log('middleware ')
    next();
}

app.use('/auth', authRoute)
app.use('/post', postRoute)
app.use('/', otherProfileRoute)

app.get('/', customMiddleware, (req, res) => {
    res.send('heyy');
})

if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'))
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`server is running in port ${PORT}`)
})

// "proxy": "http://localhost:8000",