const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://greenjvtraining:hint1384@cluster0.yje52dv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';



//const bodyParser = require('body-parser'); // express 4.16미만일 때 모듈 설치 필요 : npm install body-parser
app.use(express.json()); //express 4.16 이상이면 내장되어 있음.
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
let mydb;

mongoClient.connect(url)
    .then(client => {
        console.log('몽고 DB 접속 성공!!');
        mydb = client.db('myweb');
        mydb.collection('members').find().toArray().then(result => {
            console.log(result);
        });
        app.listen(8081, function(){
            console.log('포트 8081 대기중...');
        });
        
    }).catch(err => {
        console.log(err);
    });

// 현 상태로 브라우저로 localhost:8081 접속하면
// Cannot GET / 
// '/' 루트 경로에 대한 요청을 처리하지 못함. (컨트롤러가 없음)



app.get('/members', function(req, res){
    //res.send('멤버목록 페이지 입니다.');
    mydb.collection('members').find().toArray().then(result => {
        console.log(result);
        res.render('usersPage', {users: result});
    });
});

app.get('/', function(req, res){
    //res.send('홈입니다.');
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/p1', function(req, res){
    res.render('p1', {
        user: {name: 'John'},
        items: ['item1', 'item2', 'item3']
    });
});

app.get('/enter', function(req, res){
    res.render('p2');
});

app.post('/regist', function(req, res){
    console.log(req.body.name);
    console.log(req.body.country);

    mydb.collection('members').insertOne(
        {name: req.body.name, country: req.body.country}
    ).then(result => {
        console.log(result);
        console.log('데이터 추가 성공');
    });

    //res.send('데이터 추가 성공...');
    //res.render('result', {name: req.body.name, comment: req.body.comment});
    res.redirect('/members');
});