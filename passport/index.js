const passport = require('passport');
const local = require('./localStrategy');
const Users_bcrypt = require('../models/users_bcrypt');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser((user_id, done) => {
        Users_bcrypt.findOne({ where: { user_id }})
            .then(user => done(null, user))
            .catch(err => done(err));
    });
    local();
}