var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/aboutus', function(req, res) {
    res.render('aboutus');
});

app.get('/ngo', function(req, res) {
    res.render('ngo');
});

app.get('/pathologies', function(req, res) {
    res.render('pathologies');
});

app.get('/register', function(req, res) {
    res.render('register');
});



app.get('/dashboard', function(req, res) {
    res.render('dashboard');
});

app.get('/activity', function(req, res) {
    res.render('activity');
});

app.get('/contactus', function(req, res) {
    res.render('contactus');
});

app.get('/bloodtest', function(req, res) {
    res.render('bloodtest');
});

app.get('/donate', function(req, res) {
    res.render('donate');
});
app.get('/request', function(req, res) {
    res.render('request');
});

app.get('/user', function(req, res) {
    res.render('user');
});

app.get('/p_dashboard', function(req, res) {
    res.render('p_dashboard');
});

app.get('/p_profile', function(req, res) {
    res.render('p_profile');
});

app.get('/p_contactus', function(req, res) {
    res.render('p_contactus');
});

app.get('/p_requests', function(req, res) {
    res.render('p_requests');
});

app.get('/p_tests', function(req, res) {
    res.render('p_tests');
});

app.get('/p_history', function(req, res) {
    res.render('p_history');
});

app.listen(8080)