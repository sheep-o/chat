const express       = require('express')
const app           = express()
const session       = require('express-session')
const bodyParser    = require('body-parser')
const server        = require('http').Server(app)
const io            = require('socket.io')(server)
const fs            = require('fs')
const moment        = require('moment')
const db = require('./db.js'),
	DB = new db('127.0.0.1', '8889', 'root', 'root', 'chat')
module.exports = DB

// Middleware
app.use(express.static(__dirname + '/views'))
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}))
app.use(bodyParser.json({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

// Create routes
fs.readdirSync(__dirname + '/routes').forEach(function(file) {
	if (file == "index.js") app.use('/', require('./routes/index.js'))
    else {
        var name = file.substr(0, file.indexOf('.'))
        app.use('/' + name, require('./routes/' + name))
    }
})

io.on('connection', socket => {
    console.log('[SOCKET-IO] New connection')

    socket.on('sent msg', msg => {
        DB.select(['*'], 'users', {condition: `uuid = '${msg.recipient}'`}, results => {
            if (results.length > 0) {
                DB.insert({
                    author: msg.author,
                    recipient: msg.recipient,
                    content: msg.content,
                    timestamp: moment().format('llll')
                }, 'messages', _ => console.log('inserted 1 row'))

                io.emit('new msg', {
                    author: msg.author,
                    recipient: msg.recipient,
                    content: msg.content
                })
            }
        })
    })
})

server.listen(3000 || process.env.port, () => {
    console.log('[EXPRESS] Listening...')
})