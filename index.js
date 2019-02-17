var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');

//start mysql connection
var connection = mysql.createConnection({
  host     : 'localhost', //mysql database host name
  user     : 'root', //mysql database user name
  password : '', //mysql database password
  database : 'video_store_db', //mysql database name
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})
//end mysql connection

//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration

//create app server
var server = app.listen(3000,  "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});

//rest api to get all results of videos
app.get('/videos', function (req, res) {
   connection.query('select * from tbl_video_store', function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//rest api to get a single video data
app.get('/videos/:id', function (req, res) {
   console.log(req);
   connection.query('select * from tbl_video_store where video_id=?', [req.params.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//rest api to create a new video record into mysql database
app.post('/videos', function (req, res) {
   var postData  = req.body;
   console.log(postData);
   connection.query('INSERT INTO tbl_video_store SET ?', postData, function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//rest api to update video record into mysql database
app.put('/videos', function (req, res) {
   connection.query('UPDATE `tbl_video_store` SET `video_name`=?,`video_full_name`=? where `video_id`=?', [req.body.video_name,req.body.video_full_name,req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//rest api to delete video record from mysql database
app.delete('/videos', function (req, res) {
   console.log(req.body);
   connection.query('DELETE FROM `tbl_video_store` WHERE `video_id`=?', [req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end('Record has been deleted!');
	});
});

//rest api to get all results of playlist
app.get('/playlist', function (req, res) {
   connection.query('select * from tbl_video_store AS A,tbl_playlist AS B WHERE A.video_id=B.video_id', function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//rest api to get a single playlist data
app.get('/playlist/:id', function (req, res) {
   console.log(req);
   connection.query('select * from tbl_video_store AS A,tbl_playlist AS B where A.video_id=B.video_id AND playlist_id=?', [req.params.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//rest api to create a new playlist record into mysql database
app.post('/playlist', function (req, res) {
   var postData  = req.body;
   console.log(postData);
   connection.query('INSERT INTO tbl_playlist SET ?', postData, function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//rest api to update playlist record into mysql database
app.put('/playlist', function (req, res) {
   connection.query('UPDATE `tbl_playlist` SET `video_id`=?,`playlist_name`=? where `playlist_id`=?', [req.body.video_id,req.body.playlist_full_name,req.body.id], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

//rest api to delete playlist record from mysql database
app.delete('/playlist', function (req, res) {
   console.log(req.body);
   connection.query('DELETE FROM `tbl_playlist` WHERE `playlist_id`=?', [req.body.id], function (error, results, fields) {
    if (error) throw error;
    res.end('Record has been deleted!');
  });
});