const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Users_bcrypt = require('../models/users_bcrypt');
const Tour = require('../models/tourlist');
var app = express();
app.set('port', process.env.PORT || 3000);

router.post('/adduser', isNotLoggedIn, async(req, res) => {
    const { user_id, password, name, age } = req.body;
    try {
        const exUser = await Users_bcrypt.findOne({ where: { user_id }});
        if(exUser) {
            return res.redirect('/adduser?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await Users_bcrypt.create({
            user_id,
            password: hash,
            name,
            age,
        });
        return res.redirect('/');
    } catch(err) {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h1>회원가입 실패</h1>');
            res.write('<div><p>양식에 맞춰 재시도 부탁드립니다.</p></div>');
            res.write("<br><br><a href='/'>로그인</a>");   
            res.write("<br><br><a href='/adduser'>회원가입</a>");
            res.end();
            return;
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h1>로그인 실패</h1>');
            res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
            res.write("<br><br><a href='/'>다시 로그인하기</a>");
            res.write("<br><br><a href='/adduser'>회원가입</a>");
            res.end();
            return;
            
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    }) (req, res, next);
});

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
    });
    res.redirect('/');
});

router.post('/change/:id', async(req, res, next) => {
    const password = req.body.password;
    if(!password){
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>비밀번호 변경 실패</h1>');
        res.write('<div><p>패스워드를 입력해주세요.</p></div>');
        res.write("<br><br><a href='/'>로그인하기</a>");
        res.write("<br><br><a href='/mypage/{{user.user_id}}'>마이페이지</a>");
        res.end();
        return;
    }
    try{
        const hash = await bcrypt.hash(password, 12);
        await Users_bcrypt.update({ password: hash }, {
            where: {
                user_id: req.params.id,
            }
        });
        req.logout((err) => {
            if(err) return next(err);
        });
        return res.redirect(303, '/');
    } catch(err){
        console.error(err);
        return next(err);
    }
});

router.post('/out/:id', async(req, res, next) => {
    try{
        await Users_bcrypt.destroy({
        where: {
            user_id: req.params.id,
        }
    });
    res.redirect(303, '/');
    } catch(err) {
        console.error(err); return next(err);
    }
});

module.exports = router;