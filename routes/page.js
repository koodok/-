const router = require('express').Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Users_bcrypt = require('../models/users_bcrypt');
const Tour = require('../models/tourlist');
const Board = require('../models/board');
const sequelize = require('sequelize');


router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', (req, res) => {
    res.render('login', {title: '로그인페이지'});
});

router.get('/mypage/:id', isLoggedIn, (req, res) => {
    res.render('mypage',{title: '마이페이지'});
});

router.get('/adduser', isNotLoggedIn, (req, res) => {
    res.render('adduser', {title: '회원가입'});
});
router.get('/dropout/:id', isLoggedIn, (req, res) => {
        res.render('dropout', {title: '회원 탈퇴'});
});
router.get('/home/:id', isLoggedIn, (req, res) => {
    res.render('home', {title: '홈화면'});
});
router.get('/tourlist/:id', isLoggedIn, (req, res) => {
    res.render('tourlist', {title: '여행 기록'});
});
router.get('/addtour/:id', isLoggedIn, (req, res) => {
    res.render('addtour', {title: '여행지 추가'});
});

router.get('/plan/:id', isLoggedIn, (req, res) => {
    res.render('plan', {title: '여행 계획 추천'});
});


router.get('/map/:id', isLoggedIn, async(req, res) => {
    //let id = req.query.user_id;
    let tour = await Tour.findAll({ where: {user_id : req.params.id},
        attributes: ['tour_id','user_id', 'name', 'town', 'latitude', 'longitude', 'address','time','price'],
    });
    res.render('map', {tour : tour});
});

router.get('/boardList', async(req, res) => {
    let boards = await Board.findAll({
        attributes: ['id', 'subject', 'author', [sequelize.fn("DATE_FORMAT", sequelize.col('created_At'),"%Y-%m-%d"), 'createdAt',], 'watch'],
        order: [['created_At', 'DESC']]
    });
    res.render('boardList', {boards: boards});
});

router.get('/boardWrite', isLoggedIn, (req, res) => {
    if(!isLoggedIn) res.rendirect('login');
    else res.render('boardWrite');
});

router.get('/boardRead', async(req, res) => {
    let id = req.query.id;
    let board = await Board.findAll({ where: {id : id},
        attributes: ['id', 'subject', 'author', 'content', [sequelize.fn("DATE_FORMAT", sequelize.col('created_At'),"%Y-%m-%d %h:%i:%s"), 'createdAt',], 'watch'],
    });
    let updwatch = await Board.increment({watch: 1}, {where: {id: id}})
                            .then((result) => {
                                console.log('watch up!');
                            }).catch((err) => {
                                console.error(err);
                            });
    res.render('boardRead', {board: board[0]}, updwatch);
});

router.get('/boardUpdate', isLoggedIn, async(req, res) => {
    let id = req.query.id;
    let board = await Board.findAll({where: {id: id}});
    res.render('boardUpdate', {board: board[0]});
});


module.exports = router;