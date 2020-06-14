const http = require('http');
const express = require('express');
const app = express();
const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager;

const hostname = '127.0.0.1';
const port = 3000;
const shutDownTimeOut = 3000;

app.get('/', (req, res) => {
    res.send("Hi!");
});




app.get('/stopServer', (req, res) => {
    res.send("Thank you - shutting down");
    console.log("stopServer requested - shutting down");
    shutdownManager.terminate(() => {
        console.log('Server is gracefully terminated');
    });

});

const server = app.listen(port, ()=> {
    console.log(`server started on ${port}`);
});

const shutdownManager = new GracefulShutdownManager(server,{ forceTimeout: shutDownTimeOut });

