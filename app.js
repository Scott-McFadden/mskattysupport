
const express = require('express');
const pino = require("pino");
const expressPino = require("express-pino-logger");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const requestCounterClass  = require("./requestCounter");
const path = require('path');
const axios = require('axios');

const port = 3000;
const shutDownTimeOut = 3000;
const logDestination = './log';
let dest;
// set up pino logging destination for non-dev enviroments
if(process.env.NODE_ENV !== "development")
{
    dest = pino.destination(logDestination);
    dest[Symbol.for('pino.metadata')] = true;
}
else
    dest = pino.destination(1);

const rc = new requestCounterClass();
const app = express();
const GracefulShutdownManager = require('@moebius/http-graceful-shutdown').GracefulShutdownManager;
const logger = pino(dest);
const expressLogger = expressPino({ logger });
const startUpTime =  new Date();

// express setup
app.set('view engine', 'ejs')
app.use(expressLogger);
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static('./public'));
app.set('views', path.join(__dirname, 'views'));




// pages

app.get('/', (req, res) => {

    rc.inc("root");

    var cookies = req.cookies;

    var cookieValue = parseInt(cookies["testcookie1"]) +1 | 1;

    res.cookie("testcookie1", cookieValue);
    res.send("Hi!");

    console.log('Cookies ',req.cookies, cookieValue );

});

//
// unit tests for testRequestCounter
//
app.get("/testRequestCounter", (req, res) => {

    rc.resetAll();
    rc.inc("test1");
    rc.inc("test1");
    rc.inc("test1");
    rc.inc("test1");
    rc.inc("test2");
    rc.inc("test2");
    var test1 = rc.getNamed("test1");
    var test2 = rc.getNamed("test2");

    console.log("Test1 should be 4, actual: ", test1);
    console.log("Test2 should be 2, actual: ", test2);
    console.log("init test - test1: ", test1, "test2", test2, "all", rc.get());
    console.log("resetting test1");
    rc.reset("test1");
    test1 = rc.getNamed("test1");
    console.log("Test1 should be 0 now, actual: ", test1);
    console.log("clear test1 - test1: ", test1, "test2", test2, "all", rc.get());
    res.json(rc.counter);

});

app.get("/healthCheck", (req, res) => {

    rc.inc("healthCheck");
    var now = new Date();
    res.json(  {
        status: "ok",
        currentTime: now.toUTCString(),
        startUpTime: startUpTime.toUTCString(),
        minutesUp: Math.abs(Math.round((now.getTime() - startUpTime.getTime())/1000/60)),
        counters: rc.get()
    }   );

    logger.info(`healthCheck request from ${ req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);

});

app.get('/stopServer', (req, res) => {
    res.send(`Thank you - shutting down from IP ${ req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
    logger.info(`stopServer requested - shutting down from IP ${ req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
    shutdownManager.terminate(() => {
        logger.info('Server is gracefully terminated');
    });
});

// weather

app.get('/weather', function (req, res)   {
    res.render('index', { title: "weather"});
});

app.post('/weather', function (req, res) {

    let city= req.body.city + ", us";
    axios({
        "method":"GET",
        "url":"https://community-open-weather-map.p.rapidapi.com/weather",
        "headers":{
            "content-type":"application/octet-stream",
            "x-rapidapi-host":"community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key":"6ec9f5b9e5msha2c42893f24ac54p1c631cjsncf7f2bd18ce2",
            "useQueryString":true
        },"params":{
            "q":city,
            "units":"Imperial"
        }
    })
        .then((response)=>{
            console.log("weatherapi response", response.data)
            let weather =  response.data
            if(weather.main === undefined){
                res.render('index', {weather: null, error: 'Error, please try again'});
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                res.render('index', {weather: weatherText, error: null});
            }

        })
        .catch((error)=>{
            console.log("weatherapi error",error)
            res.render('index', {weather: null, error: 'Error, please try again'});
        })
});



// start server

const server = app.listen(port, ()=> {
    logger.info(`server started on ${port}`);
});

const shutdownManager = new GracefulShutdownManager(server,{ forceTimeout: shutDownTimeOut });

