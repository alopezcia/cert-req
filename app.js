const express = require('express');
const http    = require('http');
const helmet  = require('helmet');
var compression = require('compression');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const admzip = require('adm-zip');

const fecha = new Date().toJSON().slice(0,10).replaceAll('-', '').replaceAll('/','');
const dbName = `./db/${fecha}.db3`;
const allDbZip = './db/allDbZip.zip';

// Borrar el zip de todas las db para volver a crearlo
if( fs.existsSync(allDbZip) ){
    try{
        fs.unlinkSync(allDbZip);
    }catch( err ){
        console.log(err);
    }
}
// Crear el zip de todas las db3 
try {
    const zip = new admzip();
    zip.addLocalFolder('./db');
    zip.writeZip( allDbZip )
    console.log(`Creado fichero comprimido ${allDbZip}`);    
} catch( err ){
    console.log(err);
}

if( !fs.existsSync(dbName)){
    fs.open( dbName, 'w', (err, file ) =>{
        if (err) throw err;
        console.log(`File ${dbName} is opened in write mode.`);
        const db = new sqlite3.Database(dbName);
        const createTable = 
            'CREATE TABLE IF NOT EXISTS uuids('+
                'id INTEGER PRIMARY KEY AUTOINCREMENT, '+
                'uuid text NOT NULL, '+
                'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)';
        db.run(createTable);
        db.close();
    });
}

const app = express();

app.use( helmet({contentSecurityPolicy: false} ));
// app.use( helmet());
app.use(compression());
app.use(express.static('./public'));

const serverHttp = http.createServer(app);

serverHttp.listen( process.env.HTTP_PORT, process.env.IP );

// app.get('/', (req, res) => { res.send('Hola Mundo')});

app.get('/api/get-uuid', (req, res) => { 
    const uuid = uuidv4();
    const db = new sqlite3.Database(dbName);
    const qry = `INSERT INTO uuids(uuid) VALUES('${uuid}')`;
    db.run(qry);
    db.close();
    res.send( uuid );
});

app.get('/api/downloadDb', (req, res) => { 
    console.log(`Solicitada descarga del fichero ${dbName}`);
    if( fs.existsSync(dbName)){
        res.download(dbName, (err)=>{
            res.status(404).send(err);
        });
    } else 
        res.status(404).send(`Error 404 - ${dbName} no encontrado`);
});

app.get('/api/downloadAll', (req, res) => { 
    console.log(`Solicitada descarga del fichero ${allDbZip}`);
    if( fs.existsSync(allDbZip)){
        res.download(allDbZip, (err)=>{
            res.status(404).send(err);
        });
    } else 
        res.status(404).send(`Error 404 - ${allDbZip} no encontrado`);
});


app.get('*', (req, res) => { 
    res.status(404).send('Error 404 - Recurso no encontrado');
});

console.log(`Servidor arrancado en puerto ${process.env.HTTP_PORT}` );
