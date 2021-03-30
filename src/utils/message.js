const generateMessage = (text, username) => {
    return {
        text,
        username,
        created_at: new Date().getTime()
    }
}

module.exports = {
    generateMessage
}