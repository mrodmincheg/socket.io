const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('#message')
const $messageFormButton = document.querySelector('#s-button')
const $messages = document.querySelector('#main')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

//Options
const {username, room} =  Qs.parse(location.search, { ignoreQueryPrefix:true })

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disable')
    socket.emit('message', e.target.elements.message.value, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            console.log(error)
        } else {
            console.log('Delivered')
        }
    })
})

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        username: message.username,
        created_at: moment(message.crated_at).format('H:m')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('sendLocation', (message) => {
    const html = Mustache.render(locationTemplate, {
        link: message.text,
        username: message.username,
        created_at: moment(message.crated_at).format('H:m')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

document.querySelector('#share-location').addEventListener('click', (e) => {
    if(!navigator) {
        return alert('No navigator here')
    }
    
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Delivered location')
            }
        })
    })
})

socket.emit('join', {username, room}, (error) => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        username: message.username,
        created_at: moment(message.crated_at).format('H:m')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})