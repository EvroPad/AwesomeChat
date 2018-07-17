let express = require('express');
let router = express.Router();

let Messages = require('../models/messages');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('welcome/index');
});

router.post('/chat', function (req, res, next) {
    if (!req.body.nickname || !req.body.name) {
        return res.sendStatus(401);
    }

    res.render('chat/index', {
        nickname: req.body.nickname,
        name: req.body.name,
        socketio: req.body.socket === 'on'
    });
});

router.get('/chat', function (req, res, next) {
    res.sendStatus(401);
});

router.get('/messages', function (req, res, next) {
    Messages.find((err, docs) => {
        res.json(docs.splice(docs.length - 101));
    });
});

router.post('/messages', function (req, res, next) {
    let newMessage = new Messages();
    newMessage.nickname = req.body.nickname;
    newMessage.message = req.body.message;
    newMessage.color = req.body.color;

    newMessage.save((err, result) => {
        if (err) throw err;
        res.json(req.body);
    });
});

module.exports = router;
