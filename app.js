var express = require('express')
    , multiparty = require('multiparty')
    , request = require('request')
    , fs = require('fs')
    , util = require('util')
    , http = require('http');

var app = express();
app.use('/static', express.static('static'));

process.on('uncaughtException', function (err) {
    console.log(err);
});

app.get('/', function (req, res) {
    res.redirect('static/index.html');
});

app.post('/upload', function(req, res, next){

    //https://github.com/request/request#streaming

    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });
    form.on('file', function(name, file) {

    var formData = {
      file: {
        value:  fs.createReadStream(file.path),
        options: {
          filename: file.originalFilename
        }
      }
    };
    console.log(formData);

    // Post the file to the upload server
    request.post({url: 'http://localhost:4000/upload', formData: formData});
    });
});

var server = app.listen(3000, '0.0.0.0' ,function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
