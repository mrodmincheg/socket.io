const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')


const {generateMessage} = require('./utils/message')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/user')

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3001
const publicDirectoryPath = path.join(__dirname, '../public')
const io = socketio(server)




app.use(express.static(publicDirectoryPath))

counter = 0
io.on('connection', (socket) => {
    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser(socket.id, username, room)

        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('Welcome!', 'Bot'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined the room!`, 'Bot'))

        callback()
    })

   
    socket.on('message', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('No bad words')
        }

        if(!message) {
            callback('No epmty message allowed.')
        }

        const user = getUser(socket.id)
        const room = user.room
        if (message) {
            io.to(room).emit('message', generateMessage(message, user.username))
            callback()
        }
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.emit('sendLocation', generateMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`, user.username))
        callback()
    })

    socket.on('disconnect', () => {
        const user = getUser(socket.id)
        if (user == undefined) {
            return socket.broadcast.emit('message', generateMessage(`Somebody has left the chat`, 'Bot'))
        }
        removeUser(socket.id)

        socket.broadcast.emit('message', generateMessage(`${user.username} has left the chat`, 'Bot'))
    })
})

server.listen(port, () => {
    console.log(`Server up on port ${port}`)
})