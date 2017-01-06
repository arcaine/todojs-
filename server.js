//설치
var express =require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('morgan');
var methodOverride = require('method-override');

// 기본 설정

    // Mysql 별도 연동하기.. ㅜㅜ

    // 그외 설정
    app.use(express.static(__dirname+'/public'))
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({type: 'application/vnd.api+json'}));
    app.use(methodOverride());

//listen
  app.listen(8080);
  console.log("success 8080!!");
