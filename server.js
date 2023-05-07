const bodyParser = require('body-parser');
let express = require('express');
let app = express();
let server = app.listen(8000);
let io = require('socket.io')(server);

app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

let money = 100;

app.get('/', function(req, res){
    res.render('index', {money});;
});

io.on('connection', function(socket){
    console.log('a person connected.');
    socket.emit('update', money); //emit money using update event

    socket.on('donate', function(){ //will listen to donate event from client
        money += 10; //this function will add 10 to the money
        io.emit('update', money); //and then sends the updated value to all connected clients
    });

    socket.on('redeem', function(){
        money -= 10;
        io.emit('update', money);
    });

    socket.on('disconnect', function(){
        console.log('disconnected');
    });
});