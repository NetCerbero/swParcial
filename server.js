const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var hbs = require('hbs');

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/parciales');


app.set('view engine','hbs');

app.get('/',(req,res)=>{
	
	res.render('index');
})


app.get('/login',(req,res)=>{
	res.render('login');
});

app.get('/room',(req,res)=>{
	res.render('room');
});


app.get('/diagramador',(req,res)=>{
	res.render('diagramador');
});

io.on('connection',function(socket){
	socket.on('chat message', function(msg){
		console.log("message: " + msg);
		io.emit('chat message', msg);
	});
});



http.listen(port,()=>{
	console.log(`escuchando peticiones en el puerto ${port}`);
});