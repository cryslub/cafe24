"use strict";
exports.__esModule = true;
var express = require("express");
var history = require("./history");
var cors = require("cors");
var app = express();
var port = 8001;
app.use(cors());
app.listen(port, function () { return console.log("Example app listening on port " + port + "!"); });
app.use('/history', history);
/*
app.get('/', function (req:Request, res:Response) {

    const index:string = __dirname+'/public/viewer.html';
    console.log(index);
    fs.readFile(index, function (err, html) {
        if (err) {
            throw err;
        }
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
    });

});*/
