/**
 * Created by Iaroslav Zhbankov on 20.12.2016.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
    //res.sendFile(__dirname + '/public');
    res.render('index.jade', {});
});

app.get('/signup', function (req, res) {
    res.render('signup.jade', {});
});

app.post('/signup', function (req, res) {
    res.send(req.body);
});

app.get('/signin', function (req, res) {
    res.render('signin.jade', {});
});

app.post('/signin', function (req, res) {
    res.send(req.body);
});

app.get('/settings', function (req, res) {
    res.render('settings.jade', {});
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Server start. Listening on port 3000')
});