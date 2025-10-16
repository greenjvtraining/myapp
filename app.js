const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://greenjvtraining:hint1384@cluster0.yje52dv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

let mydb;

mongoClient.connect(url)
    .then(client => {
        mydb = client.db('myweb');
        console.log('몽고 DB 연결 성공...');

        app.listen(8081, function(){
            console.log('Port 8081 listening...');
        });

    }).catch(err => {
        console.log('연결 실패...');
    });

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/users', function(req, res){
    //res.send('user 목록 페이지');
    mydb.collection('members').find().toArray()
        .then(result => {
            console.log(result);
            res.render('usersPage', {users: result});
        });
});

app.get('/userform', function(req, res){
    //res.send('user 등록 페이지');
    res.render('userform');
});

app.post('/regist', async function(req, res){
    //res.send('user 등록 처리');
    const name = req.body.name;
    const country = req.body.country;

    const result = await mydb.collection('members').insertOne(req.body)
    console.log(req.body);
    res.redirect('/users');
});

app.get('/user', function(req, res){
    //res.send('user 정보 조회...');
    let username = req.query.name;
    console.log('param : ' + username );
    //let username = 'John';
    mydb.collection('members').findOne({name: username})
        .then(result => {
            res.render('userPage', {user: result});
        });
});

app.post('/userdel', async function(req, res) {
    const result = await mydb.collection('members').deleteMany({name: req.body.name});
    console.log(result);
    res.redirect('/users');
});

app.post('/update', async function(req, res){
    const result = await mydb.collection('members')
        .updateOne({name: req.body.name}, {$set: req.body});
    console.log(req.body);
    res.redirect('/users');
});