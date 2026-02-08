const net = require('net');
const client = new net.Socket();
client.connect(5000, '127.0.0.1', function () {
    console.log('Connected');
    client.destroy();
});
client.on('error', function (err) {
    console.log('Error: ' + err.message);
});
