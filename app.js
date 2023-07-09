const express = require('express');
const http    = require('http');
const helmet  = require('helmet');
var compression = require('compression');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use( helmet({contentSecurityPolicy: false} ));
// app.use( helmet());
app.use(compression());
app.use(express.static('./public'));

const serverHttp = http.createServer(app);

serverHttp.listen( process.env.HTTP_PORT, process.env.IP );

// app.get('/', (req, res) => { res.send('Hola Mundo')});

app.get('/api/get-uuid', (req, res) => { 
    res.send( uuidv4())
});

app.get('*', (req, res) => { 
    res.status(404).send('Error 404 - Recurso no encontrado');
});

console.log(`Servidor arrancado en puerto ${process.env.HTTP_PORT}` );
