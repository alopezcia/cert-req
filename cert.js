const express = require('express');
const https   = require('https');
const helmet  = require('helmet');
var compression = require('compression');
const cors = require('cors');
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const admzip = require('adm-zip');
const { isValidSSL  } = require('ssl-validator');

const fecha = new Date().toJSON().slice(0,10).replaceAll('-', '').replaceAll('/','');
const dbName = `./dbCert/${fecha}_cert.db3`;
const allDbZip = './dbCert/allDbCertZip.zip';


const httpsServerOptions = {
    key:  fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
    requestCert: true,
    rejectUnauthorized: true
};

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
    zip.addLocalFolder('./dbCert');
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
            'CREATE TABLE IF NOT EXISTS certs('+
                'id INTEGER PRIMARY KEY AUTOINCREMENT, '+
                'cert text NOT NULL, '+
                'registro DATETIME DEFAULT CURRENT_TIMESTAMP)';
        db.run(createTable);
        db.close();
    });
}

const app = express();

app.use( helmet({contentSecurityPolicy: false} ));
// app.use( helmet());
app.use(compression());
app.use(cors());

const serverHttps = https.createServer(httpsServerOptions, app);

serverHttps.listen( process.env.API_HTTPS_PORT, process.env.IP );

app.use( (req, res, next ) => {
    if( req.client.authorized ) 
        next();
    else {
        res.status(401).send('Unauthorized');
    }
});



app.get('/api/get-cert', async (req, res) => { 
    const cert = req.socket.getPeerCertificate(true);
    // if (!(await isValidSSL(cert))) {
    //     res.status(401).send('Unauthorized');
    // }
    // else {
        const b64  = cert.raw.toString('base64');
        const db = new sqlite3.Database(dbName);
        const qry = `INSERT INTO certs(cert) VALUES('${b64}')`;
        db.run(qry);
        db.close();
        res.send( `Hello${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!` );
//    }
    // client.raw.toString('base64')
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

console.log(`Servidor arrancado en puerto ${process.env.API_HTTPS_PORT}` );
