const http = require('http');
const url = require('url');
const mysql = require("mysql");
const express = require('express');
const app = express();
const hostname = '/COMP351/individualProject'
const PORT = process.env.PORT || 8888;

const con = mysql.createConnection({
    host: "localhost",
    user: "bowenxue_nodemysql",
    password: "nodemysql123",
    database: "bowenxue_nodemysql"
});

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type, Authorization, Content-Length, X-Requested-With');
    next();                                
});


app.post(hostname+"/API/v1/updateOne/",(req,res) => {
    const q = url.parse(req.url, true);
    const qdata = q.query;
    let questionID = qdata.questionID;
    let content = qdata.content;
    
    let sql = `UPDATE quiz SET content = (?) WHERE questionID = (?)`;
    let data = [content, questionID];
    console.log(content);
    con.query(sql, data, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });   
});

app.post(hostname+"/API/v1/deleteOne/",(req,res) => {
    const q = url.parse(req.url, true);
    const qdata = q.query;
    let questionID = qdata.questionID;    
    let sql = `DELETE FROM quiz WHERE questionID = (?)`;
    let data = [questionID];    
    con.query(sql, data, function (err, result) {
        if (err) throw err;
        console.log("1 record deleted");
    });   
});

app.post(hostname+"/API/v1/addOne/",(req,res) => {     
    let sql = `INSERT INTO quiz (content) values (?)`;
    let data = [""];
    con.query(sql, data, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });   
});

app.get(hostname+"/API/v1/get-admin-contents/",(req,res) => {
    let sql = `SELECT * FROM quiz WHERE 1`;
    /*

    result = [{questionID:1,content:xxxxx},{},{}]
    
    */
    con.query(sql, function(err,result){
        if(err) throw err;
        let word = '';
        let countArray=[];
        for(let i=0;i<result.length; i++){
            countArray.push(result[i].questionID)
            word += "<textarea id='"+result[i].questionID+"'>"+ result[i].content+"</textarea>"
            +"<button class='save' onclick='save("+result[i].questionID+")'>Update in DB</button>"+
            "<button class='delete' onclick='deleteOne("+result[i].questionID+")'>Delete</button>"+"<br> <hr>";
        }
        let word1='';
        /* [questionID1,questionID2, questionID3] */
        for(let i=0; i<countArray.length;i++){
            word1 += "save(" + countArray[i] + ");"
        }
        /* word1 = "save(questionID1);save(questionID2);..." */
        let word11 = word1 + "setTimeout(function() { location.reload(); }, 100);";
        let postAll = "<button class='save' onclick = '" + word11 +"'> Save and replace DB</button>"
        res.end(word+postAll);
        
    });
});
app.get(hostname+"/API/v1/get-reader-contents/",(req,res) => {
    let sql = `SELECT * FROM quiz WHERE 1`;
    con.query(sql, function(err,result){
        if(err) throw err;
        let word = '';
        for(i=0;i<result.length; i++){
            word += "<textarea readOnly = true id='"+result[i].questionID+"'>"+ result[i].content+"</textarea> <hr>"
            +"<br>";
        }
        res.send(word);        
    });
});

app.listen(PORT,(err) => {
    if(err) throw err;
    console.log("Listening to port", PORT);
});