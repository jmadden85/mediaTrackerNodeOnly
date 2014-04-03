var mongoose = require('mongoose');
var http = require('http');
var qs = require('querystring');
var Schema = mongoose.Schema;


/*******
 * Media Schema
 *******/
var MediaSchema = new Schema({
    nid: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    identifier: {
        type: String,
        required: true,
        unique: true
    }
});

mongoose.connect('mongodb://localhost/media');

var Media = mongoose.model('Media', MediaSchema);



var server = http.createServer(function(req, res) {
    if (req.method === 'POST' && req.url.substr(0, 6) === '/media') {
        var query = qs.parse(req.url.substr(7));
        var uniqueId = query.uid + query.nid;
        var media = new Media(req.body);
        Media.findOneAndUpdate({identifier: uniqueId},
            {
                nid:query.nid,
                uid:query.uid,
                identifier: uniqueId,
                time:query.time
            },
            {upsert: true},
            function (err) {
            if (err) {
                return err;
            }
        });
    }
    res.writeHead(200);
    res.end();
});
server.listen(3000);