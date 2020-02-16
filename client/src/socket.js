let element = (id) => {
    return document.getElementById(id);
}

// Get Elements
let status = element('status');
let messages = element('messages');
let textarea = element('textarea');
let username = element('username');
let clearBtn = element('clear');

// Set default status
let statusDefault = status.textContent;

let setStatus = function (s) {
    // Set status
    status.textContent = s;

    if (s !== statusDefault) {
        var delay = setTimeout(function () {
            setStatus(statusDefault);
        }, 4000);
    }
}

// Connect to socket.io
let socket = io.connect('https://mongo-chat-server.herokuapp.com/');

// Check for connection
if (socket !== undefined) {
    console.log('Connected to socket...');

    // Handle Output
    socket.on('output', function (data) {
        //console.log(data);
        if (data.length) {
            for (let x = 0; x < data.length; x++) {
                // Build out message div
                var message = document.createElement('div');
                message.setAttribute('class', 'chat-message');
                message.textContent = data[x].name + ": " + data[x].message;
                messages.appendChild(message);
                messages.insertBefore(message, messages.firstChild);
            }
        }
    });

    // Get Status From Server
    socket.on('status', function (data) {
        // get message status
        setStatus((typeof data === 'object') ? data.message : data);

        // If status is clear, clear text
        if (data.clear) {
            textarea.value = '';
        }
    });

    // Handle Input
    textarea.addEventListener('keydown', function (event) {
        if (event.keyCode === 13 && event.shiftKey == false) {
            console.log("pressed")
            // Emit to server input
            socket.emit('input', {
                name: username.value,
                message: textarea.value
            });

            event.preventDefault();
        }
    })

    // Handle Chat Clear
    clearBtn.addEventListener('click', function () {
        socket.emit('clear');
    });

    // Clear Message
    socket.on('cleared', function () {
        messages.textContent = '';
    });
}