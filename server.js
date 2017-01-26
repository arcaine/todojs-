//설치
var express =require('express');
var app = express();
// var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mysql = require('mysql');

//세션 정보 파일로 저장
var session = require('express-session')
var FileStore = require('session-file-store')(session);
//passport.js
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


// 기본 설정

    // Mysql 별도 연동하기.. ㅜㅜ
    var conn = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '111111',
      database : 'todo'
    });
    conn.connect();

    // 그외 설정
    app.use(express.static(__dirname+'/public'))
    // app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({type: 'application/vnd.api+json'}));
    app.use(methodOverride());

    //cookieParser 모듈에 담기
    var cookieParser = require('cookie-parser');
    app.use(cookieParser('fsdfsdfweerewr'));

    //session과 passport
    var app =express();
    app.use(session({
      secret : '111',
      resave : false,
      saveUninitialized:true,
      store : new FileStore()
    }));
    app.use(passport.initialize()); //초기화후 시작
    app.use(passport.session()); // 인증시 세션 사용 세션 사용코드보다 뒤쪽이어야 함



    //api
      //get all todos
        app.get('/api/todos', function(req, res) {
          var sql = 'SELECT * FROM todo_list';
          conn.query(sql, function(err,result){
              res.json(result);
          });
        });
      // 받아야지
        app.post('/api/todos', function(req,res){
          var sql = 'INSERT INTO todo_list (name) VALUES(?)'
          var text = req.body.text;
          conn.query(sql,[text],function(err,result){
            if(err){
              console.log(err);
            }else{
              var sql = "SELECT * FROM todo_list";
              conn.query(sql,function(err,result){
                res.json(result);
              })};
          });
      });
        //지워야지
        app.delete('/api/todos/:todo_id',function(req,res){
          var sql = "DELETE FROM todo_list WHERE id=?"
          var _id = req.params.todo_id;
          conn.query(sql,[_id],function(err,result){
            if(err){
              console.log(err);
            }else{
              var sql = "SELECT * FROM todo_list";
              conn.query(sql,function(err,result){
                res.json(result);
              });
            }
          });
        });
        //방문 counting(cookie로)
app.get('/api/count',function(req,res){
  if(req.signedCookies.count){
    var count =parseInt(req.signedCookies.count);
  } else{
    var count = 0 ;
  }
  count = count+1;
  res.cookie('count',count,{signed: true});
  res.json(count);
});


//세션
// 세션마다 한사람이 done(null, 유저네임)이 저장됨
passport.serializeUser(function(user, done) {
  console.log('serialsuccess2',user)
  done(null, user.authId);
});

// id 값을 기준으로 사용자를 검색하는 작업을 함
passport.deserializeUser(function(id, done) {
  for(var i=0;i<users.length;i++){
    var user = users[i];
    if(user.authId === id){
      return done(null,user);
    }
  }
  done('There is no user');
});

//로컬 전략을 만듬 -> 객체를 만듬
passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username;
    var pwd = password;
    for(var i=0; i < users.length; i++){
        var user =users[i];
        if(uname === user.username && pwd === user.password){
          console.log('success1'+user)
          done(null,user);
        }else{
          done(null,false);
        }
      }
    done(null,false);
  }
));

//api/auth
app.get('api/auth',function(req,res){
  res.json(req.user);
});

app.post(
  '/auth/login',
  passport.authenticate(
    'local',
    {
      successRedirect :'/welcome',//성공시 리다이렉트
      failureRedirect :'/auth/login',
      failureFlash : false
    }
  )
);


//프론트로 가자!
app.get('*',function(req,res){
  res.sendFile(__dirname + '/public/index.html');
});


//listen
  app.listen(8080);
  console.log("success 8080!!");
