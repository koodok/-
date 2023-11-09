const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Users_bcrypt = require('../models/users_bcrypt');
const Tour = require('../models/tourlist');
const mysql = require('mysql');
var app = express();

app.set('port', process.env.PORT || 3000);

var pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'user333',
    password : 'password333',
    database : 'DB01',
    debug : false
});

router.post('/addtour', isLoggedIn, async(req, res, next) => {
    const { user_id, name, town, latitude, longitude, address, time, price } = req.body;

    try {
        const exUser = await Tour.findOne({ where: { user_id }});
        const exName = await Tour.findOne({ where: { name }});
        if(exUser) {
            if(exName){
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});

                res.write('<h2>여행지 추가 실패- 이미 '+name+'이(가) 저장되어 있습니다.</h2>');
                res.write("<br><a href='/addtour/{{user.user_id}}'>재시도</a>");
                res.end()
                return;
            }
        }
        const rowCount = await Tour.count();
        const tour_id = rowCount + 1; 
        await Tour.create({
            tour_id, user_id, name, town, latitude, longitude, address, time, price,
        });
        return res.redirect('/tourlist/:id');
    } catch(err) {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>여행지 추가 실패- 양식에 맞게 작성해주세요.</h2>');
        res.write("<br><a href='/addtour/{{user.user_id}}'>재시도</a>");
        res.end()
        return;
        
        /*console.error(err);
        return next(err);*/
    }
});

router.post('/plan', isLoggedIn, (req, res) => {
    const { town, date, purpose,transportation } = req.body;

    try {
        async function chat(question) {
          return fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${'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'}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: question }],
            }),
          })
            .then((res) => res.json())
            .then((data) => data.choices[0].message.content);
        }
      
        async function renderResponse() {
          const answer = await chat(
            town +
              "에서" +
              date +
              "동안 여행을 갈건데 여행 목적은" +
              purpose +
              "고 교통수단은" +
              transportation +
              "을 이용할 거야. 여행 계획을 짜줘."
          );
          console.log(answer);
          res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
      
          res.write("<h2>My Travel Plan-여행 계획 추천</h2>");
            
          const lines = answer.split("\n");
          for (let line of lines) {
            res.write("<p>" + line + "</p>");
          }
          res.write('<br><br><a href=/home/{{user.user_id}}">홈으로</a>')
          res.write("<br><a href='/plan/{{user.user_id}}'>계획 다시 세우기</a>");
          res.end();
          return;
        }
      
        renderResponse();
      } catch (err) {
        console.error(err);
        res.writeHead("200", { "Content-Type": "text/html;charset=utf8" });
        res.write("<h2>여행 계획 추천 실패.</h2>");
        res.write("<br><a href='/plan/{{user.user_id}}'>재시도</a>");
        res.end();
        return;
      }
});

router.post('/list/:id', isLoggedIn, (req, res) => {
    const { user_id, town } = req.body;

    try {
         
        if (pool) {
            
            GetTI(town, user_id, function(err, rows) {
                if (err) {
                    console.error('검색 중 에러 발생 : ' + err.stack);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h2>검색 중 에러 발생</h2>');
                    res.write('<p>' + err.stack + '</p>');
                    res.end();

                    return;
                }

                if (rows) {
                    console.dir(rows);

                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h1>Plavel - My Travel Log</h1>');
                    res.write('<h2>내가 방문한 여행지 - '+town+'</h2>');

                    for(var i=0; i<rows.length; i++){
                        var rname = rows[i].name;
                        var rlatitude = rows[i].latitude;
                        var rlongitude = rows[i].longitude;
                        var raddress = rows[i].address;
                        var rtime = rows[i].time;
                        var rprice = rows[i].price;
                        res.write('<li>'+rname+' - '+raddress+' '+'| 위도 : '+rlatitude+' | 경도 : '+rlongitude+' | 소요시간 : '+rtime*60+'분 | 비용 : '+rprice*10000+'원'+'</li>');
                    }
                    res.write("<br><br><a href='/tourlist/{{user.user_id}}'>다시 검색하기</a>");
                    res.write('<br><br><a href=/home/{{user.user_id}}">홈으로</a>');
                    res.end();
                
                } else {  
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    res.write('<h1>방문한 도시가 아닙니다!</h1>');
                    res.write('<div><p>도시 이름을 다시 확인하십시오.</p></div>');
                    res.write("<br><br><a href='/tourlist/{{user.user_id}}'>다시 검색하기</a>");
                    res.write('<br><br><a href=/home/{{user.user_id}}">홈으로</a>');
                    res.end();
                }
            });
        } else {  
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h2>데이터베이스 연결 실패</h2>');
            res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
            res.end();
        }
    } catch(err) {
        console.error(err);
        return next(err);
    }
});

var GetTI = function(town, user_id, callback) {
	console.log('GetTI 호출됨 : ' + town );

	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
       
        var columns = ['town', 'name', 'latitude', 'longitude', 'address','time','price'];
        var tablename = 'tourlist';

        var exec = conn.query("select ?? from ?? where user_id=? and town = ?", [columns, tablename, user_id, town], function(err, rows) {
            conn.release();  
            console.log('실행 대상 SQL : ' + exec.sql);

            if (rows.length > 0) {
    	    	console.log('[%s] 여행지 찾음.', town);
    	    	callback(null, rows);
            } else {
            	console.log("일치하는 여행지를 찾지 못함.");
    	    	callback(null, null);
            }
        });

        conn.on('error', function(err) {
            console.log('데이터베이스 연결 시 에러 발생함.');
            console.dir(err);

            callback(err, null);
      });
    });

}

module.exports = router;