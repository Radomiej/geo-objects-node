var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug');

var indexRouter = require('./routes/index');
var objectsRouter = require('./routes/objects');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/objects', objectsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 1337);



//MongodDB
let mongoDbHost = process.env.MONGODB_HOST || 'localhost';
let mongoDbPort = process.env.MONGODB_PORT || '27017';
let mongoDbDatabase = process.env.MONGODB_DATABASE || 'geo-objects-dev';

//Import the mongoose module
var mongoose = require('mongoose');

//Setup new features
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//Set up default mongoose connection
var mongoDB = 'mongodb://' + mongoDbHost + ':' + mongoDbPort + '/' + mongoDbDatabase;
mongoose.connect(mongoDB, { useNewUrlParser: true });
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




console.log('MongoDB: ' + mongoDB);
//console.err('MongoDB: ' + mongoDB);

//Run server
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

module.exports = app;
