const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Users_bcrypt = require('../models/users_bcrypt');
const Board = require('../models/board');

router.post('/create', isLoggedIn, async(req, res, next) => {
    const { subject, content, name } = req.body;
    try {
        await Board.create({
            subject,
            content,
            author: name,
        });
        return res.redirect('/boardList');
    } catch(err) {
        console.error(err);
        return next(err);
    }
});
router.post('/update', isLoggedIn, async(req, res, next) => {
    const { subject, content } = req.body;
    try {
        await Board.update({
            subject: subject,
            content: content,
        }, {
            where: {id: req.body.bid}
        });
        return res.redirect('/boardList');
    } catch(err) {
        console.error(err);
        return next(err);
    }
});

router.post('/delete', isLoggedIn, async(req, res, next) => {
    let bid = req.body.bid;
    try {
        await Board.destroy({
            where: {
                id: bid,
            }
        });
        return res.redirect('/boardList');
    } catch(err) {
        console.error(err);
        return next(err);
    }
});

module.exports = router;