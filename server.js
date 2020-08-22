const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static('front'))

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('list_updated', message => {
        console.log(message)
        socket.broadcast.emit('list_updated', message)
    })
    socket.on('list_created', message => {
        console.log(message)
        socket.broadcast.emit('list_created', message)
    })
    socket.on('list_deleted', message => {
        console.log(message)
        socket.broadcast.emit('list_deleted', message)
    })
});

const port = process.env.PORT || 3000
http.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
