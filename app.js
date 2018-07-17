const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressHsb = require('express-handlebars');
const mongoose = require('mongoose');

const routes = require('./routes/index');

const app = express();
const server = app.listen(5555);

mongoose.connect('mongodb://chat:temp1234@ds241121.mlab.com:41121/chat');
const socket = require('./services/socket')(server);

// view engine setup
app.engine('.hbs', expressHsb({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

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

module.exports = app;
