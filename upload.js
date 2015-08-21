var express = require('express')
    , multiparty = require('multiparty')
    , cors = require('cors')
    , util = require('util')
    , app = express();

app.use(cors());
process.on('uncaughtException', function (err) {
    console.log(err);
});

app.get('/', cors(), function(req, res, next){
    res.json({msg: 'This is CORS-enabled for all origins!'});
});

app.post('/upload', cors(), function(req, res, next){
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });
    form.on('file', function(name,file) {
        console.log(file);
        console.log(name);
    });

});

app.listen(4000, function(){
    console.log('CORS-enabled web server listening on port 4000');
});
