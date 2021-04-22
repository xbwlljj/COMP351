const http = require('http');
const url = require('url');
const mysql = require("mysql");
const express = require('express');
const app = express();
const hostname = 'bowenxue.net/COMP351/individualProject'
const PORT = process.env.PORT || 8888;

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "webdev"
});

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers','Content-Type, Authorization, Content-Length, X-Requested-With');
    next();                                
});

let putRequest = 0;
let postRequest = 0;
let getRequet1 = 0;
let getRequest2 = 0;
let deleteRequest = 0;

app.put("/API/v1/quotes/:id",(req,res) => {
    putRequest += 1;

       let body ="";
       req.on('data', function (chunk){
           if(chunk!=null){
               body += chunk;
               console.log(body);
           }
       });
       req.on('end',function(){
           let q = `update quiz set content=(?) where questionID = ${req.params.id}`
           console.log(q);
           let curContent=[JSON.parse(body).content]
           con.query(q,curContent,(err,result)=>{
               if(err){
                   throw err;
               };
               
           });
           res.end("Updated");
       });
});

app.delete("/API/v1/quotes/:id",(req,res) => {    
    deleteRequest +=1;   
    let sql = `DELETE FROM quiz WHERE questionID = ${req.params.id}`;
    console.log(sql);      
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record deleted");
    });
    res.status(200).end();   
});

app.post("/API/v1/quotes",(req,res) => {
    postRequest +=1; 
    let sql = `INSERT INTO quiz (content) values (?)`;
    let data = [""];
    con.query(sql, data, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.status(201).end(); 
});

app.get("/API/v1/quotes/",(req,res) => {
    getRequet1 +=1;
    let sql = `SELECT * FROM quiz WHERE 1`;
   
    con.query(sql, function(err,result){
        if(err) throw err;
        let word = '';
        let countArray=[];
        for(let i=0;i<result.length; i++){
            countArray.push(result[i].questionID)
            word += "<textarea id='"+result[i].questionID+"'>"+ result[i].content+"</textarea>"
            +"<button onclick='save("+result[i].questionID+")'>Update in DB</button>"+
            "<button class='delete' onclick='deleteOne("+result[i].questionID+")'>Delete</button>"+"<br> <hr>";
        }
        let word1='';
        /* [questionID1,questionID2, questionID3] */
        for(let i=0; i<countArray.length;i++){
            word1 += "save(" + countArray[i] + ");"
        }
        /* word1 = "save(questionID1);save(questionID2);..." */
        let word11 = word1 + "setTimeout(function() { location.reload(); }, 100);";
        let postAll = "<button onclick = '" + word11 +"'> Save and replace DB</button>"
        res.status(200).end(word+postAll);
        
    });
});
app.get("/API/v1/reader-quotes/",(req,res) => {
    getRequest2 +=1;
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

app.get("/API/v1/apis/",(req,res)=>{
    let apis = {};
    let putObj = JSON.stringify({method:"PUT",Endpoint:"/API/v1/quotes/:id",Requests:putRequest});
    let getObj1 =  JSON.stringify({method:"GET",Endpoint:"/API/v1/quotes",Requests:getRequet1});
    let getObj2 =  JSON.stringify({method:"GET",Endpoint:"/API/v1/reader-contents",Requests:getRequest2});
    let postObj =  JSON.stringify({method:"POST",Endpoint:"/API/v1/quotes",Requests:postRequest});
    let deleteObj =  JSON.stringify({method:"DELETE",Endpoint:"/API/v1/quotes/:id",Requests:deleteRequest});

    apis = {putObj,getObj1,getObj2,postObj,deleteObj};
    let apisJSON = JSON.stringify(apis)
    res.send(apisJSON);
    res.status(200).end();
})

app.listen(PORT,(err) => {
    if(err) throw err;
    console.log("Listening to port", PORT);
});