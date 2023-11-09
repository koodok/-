exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<div><p>로그인 후 접속해 주세요.</p></div>');
        res.write("<br><br><a href='/'>로그인</a>");
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태 입니다');
        res.redirect(`/?error=${message}`);
    }
};