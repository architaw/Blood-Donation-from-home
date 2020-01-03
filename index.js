const express = require('express');
const app=express();
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var mongoose=require('mongoose');
const port =3000;
var bodyparser =require('body-parser');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine","ejs");
app.use('/assets', express.static('assets'));

mongoose.connect('mongodb://localhost/hands_On',{useNewUrlParser:true});
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection:'));
db.once('open',function(){console.log("Connection to the database")});

app.use('/',express.static('/static'));

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

var routes = require('./router/route');
app.use('/', routes);
// var ngo = require('./router/ngoRoutes');
// app.use('/', ngo);

app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

app.listen(port,()=>console.log(`Example app listening on port ${port}!`))
