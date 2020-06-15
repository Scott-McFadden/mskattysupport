var req = unirest("GET", "https://community-open-weather-map.p.rapidapi.com/weather");

req.query({
    "callback": "test",
    "id": "2172797",
    "units": "%22metric%22 or %22imperial%22",
    "mode": "xml%2C html",
    "q": "London%2Cuk"
});

req.headers({
    "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
    "x-rapidapi-key": "6ec9f5b9e5msha2c42893f24ac54p1c631cjsncf7f2bd18ce2",
    "useQueryString": true
});


req.end(function (res) {
    if (res.error) throw new Error(res.error);

    console.log(res.body);
});

/*

https://rapidapi.com/community/api/open-weather-map




 */

var unirest = require("unirest");

var req = unirest("GET", "https://community-open-weather-map.p.rapidapi.com/forecast");

req.query({
    "q": "san francisco%2Cus"
});

req.headers({
    "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
    "x-rapidapi-key": "6ec9f5b9e5msha2c42893f24ac54p1c631cjsncf7f2bd18ce2",
    "useQueryString": true
});


req.end(function (res) {
    if (res.error) throw new Error(res.error);

    console.log(res.body);
});

const axios = require("axios");

axios({
    "method":"GET",
    "url":"https://community-open-weather-map.p.rapidapi.com/forecast",
    "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"community-open-weather-map.p.rapidapi.com",
        "x-rapidapi-key":"6ec9f5b9e5msha2c42893f24ac54p1c631cjsncf7f2bd18ce2",
        "useQueryString":true
    },"params":{
        "q":"nashville%2Cus"
    }
})
    .then((response)=>{
        console.log(response)
    })
    .catch((error)=>{
        console.log(error)
    })