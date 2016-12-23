/**
 * Created by Iaroslav Zhbankov on 20.12.2016.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var dataTransorm = require('./public/js/dataTransformation');
var url = 'mongodb://localhost:27017/vote_up';
var session = require('express-session');


app.use("/", express.static('public'));
app.use("/dashboard", express.static('public'));
app.use("/poll", express.static('public'));
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

app.get('/dashboard/newpoll', function (req, res) {
    res.render('newpoll.jade', {scripts: ['js/addOption.js']});
});

app.get('/poll/:pollname', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        console.log('db opened');
        db.collection('polls').findOne({"pollname": req.params.pollname}, function (err, item) {
            if (item) {
                var username = item.username;
                var pollname = item.pollname;
                var options = item.options;
                db.close();
                res.render('poll.jade', {
                    title: req.params.pollname,
                    username: username,
                    optionsSize: dataTransorm.getSize(options),
                    optionsName: dataTransorm.getName(options)
                });
            } else {
                console.log('no such poll');
                db.close();
                res.render('poll.jade', {});
            }
        });
    });


});

app.post('/poll/:pollname', function (req, res) {

    MongoClient.connect(url, function (err, db) {
        db.collection('polls').findOne({"pollname": req.params.pollname}, function (err, item) {
            var newoptions = dataTransorm.setSize(item.options, req.body.name);
            db.collection('polls').update({"pollname": req.params.pollname},
                {"$set": {"options": newoptions}}, function (err, doc) {
                    var username = item.username;
                    var options = newoptions;
                    db.close();
                    res.render('poll.jade', {
                        title: req.params.pollname,
                        username: username,
                        optionsSize: dataTransorm.getSize(options),
                        optionsName: dataTransorm.getName({})
                    });
                });
        });
    });
});

app.post('/dashboard/newpoll', function (req, res) {
    var pollname = req.body.pollname;
    var username = req.session.user;
    var options = dataTransorm.setSizeOpt(req.body);

    MongoClient.connect(url, function (err, db) {
        db.collection('polls').findOne({"pollname": pollname}, function (err, item) {
            if (item) {
                db.close();
                console.log("poll already exist");
                res.redirect('/poll/' + pollname);
            } else {
                db.collection('polls').insertOne({
                    "username": username,
                    "pollname": pollname,
                    "options": options

                }, function (err, result) {
                    if (!err) {
                        console.log("poll added successfuly");
                        db.close();
                        console.log('db closed');
                    }
                });

                res.redirect('/poll/' + pollname);
            }
        });
    });
});

app.get('/dashboard/polls', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        var resent = db.collection('polls').find({}, {
            'username': true,
            "pollname": true,
            'options': true
        }).sort({_id: -1}).toArray(function (err, result) {
            res.send(result);
        });

        db.close();
    });
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    console.log("session ends");
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Server start. Listening on port 3000')
});