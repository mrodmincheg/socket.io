const users = {}

const rooms = {}

const names = {}

const addUser = (id, username, room) => {
    if (!username || !room) {
        return {
            error: 'User and room are required!'
        }
    }

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
 

    const existingUser = names[username]


    if (existingUser) {
        return {
            error: 'User name is exist!'
        }
    }

    const user = {id, username, room}
    users[id] = user
    
    
    if (!rooms[room]) {
        rooms[room]  = {}
    }
    rooms[room][id] = user

    names[username] = true;

    return { user }
}

const removeUser = (id) => {
    const user = users[id]
    delete names[user.username]
    delete users[id]

}

const getUser = (id) => {
    return users[id]
}

const getUsersInRoom = (room) => {
    return rooms[room]
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

