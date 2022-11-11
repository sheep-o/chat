const app       = require('express')()
const server    = require('http').Server(app)
const io        = require('socket.io')(server)

app.set('view engine', 'ejs')

const index = require('./routes/index')

app.use('/', index)

io.on('connection', socket => {
    console.log('[SOCKET-IO] New connection')

    socket.on('sent msg', msg => {
        io.emit('new msg', msg)
    })
})

server.listen(3000 || process.env.port, () => {
    console.log('[EXPRESS] Listening...')
})