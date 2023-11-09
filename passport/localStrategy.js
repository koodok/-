const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const Users_bcrypt = require('../models/users_bcrypt');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'user_id',
        passwordField: 'password',
    }, async (user_id, password, done) => {
        try {
            const exUser = await Users_bcrypt.findOne({ where: { user_id }});
            if(exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if(result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호 불일치' });
                }
            } else {
                done(null, false, { message: '미가입 회원' });
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
};