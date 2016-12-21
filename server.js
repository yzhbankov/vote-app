/**
 * Created by Iaroslav Zhbankov on 20.12.2016.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/vote_up';
var session = require('express-session');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: "secretword", resave: false, saveUninitialized: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
    res.render('index.jade', {});
});

app.get('/signup', function (req, res) {
    res.render('signup.jade', {});
});

app.post('/signup', function (req, res) {
    var username = req.body.user;
    var email = req.body.email;
    var password = req.body.password;

    MongoClient.connect(url, function (err, db) {
        db.collection('users').findOne({"username": username}, function (err, item) {
            if (item) {
                db.close();
                console.log("user already exist");
                res.redirect('/signup');
            } else {
                req.session.user = username;
                db.collection('users').insertOne({
                    "username": username,
                    "email": email,
                    "password": password
                }, function (err, result) {
                    if (!err) {
                        console.log("user added successfuly");
                    }
                });
                db.close();
                res.redirect('/dashboard');
            }
        });
    });
});

app.get('/signin', function (req, res) {
    res.render('signin.jade', {});
});

app.post('/signin', function (req, res) {
    var username = req.body.user;
    var password = req.body.password;

    MongoClient.connect(url, function (err, db) {
        db.collection('users').findOne({"username": username, "password": password}, function (err, item) {
            if (item) {
                req.session.user = username;
                db.close();
                console.log("user existing");
                res.redirect('/dashboard');
            } else {
                db.close();
                console.log("password or username is invalid");
                res.redirect('/signin');
            }
        });
    });
});

app.get('/settings', function (req, res) {
    res.render('settings.jade', {});
});

app.post('/settings', function (req, res) {
    var username = req.body.user;
    var curPassword = req.body.currentPassword;
    var password1 = req.body.newPassword1;
    var password2 = req.body.newPassword2;
    if (password1 === password2) {
        MongoClient.connect(url, function (err, db) {
            db.collection('users').update({"username": username, "password": curPassword},
                {"$set": {"password": password1}}, function (err, doc) {
                    res.redirect('/');
                    db.close();
                });
        });
    } else {
        res.redirect('/settings');
    }
});

app.get('/dashboard', function (req, res) {
    if (!req.session.user) {
        res.redirect("/");
        console.log("no such session")
    } else {
        console.log("current session");
        res.render('dashboard.jade', {});
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    console.log("session ends");
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Server start. Listening on port 3000')
});