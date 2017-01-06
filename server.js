//설치
var express =require('express');
var app = express();
// var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mysql = require('mysql');
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




//listen
  app.listen(8080);
  console.log("success 8080!!");
