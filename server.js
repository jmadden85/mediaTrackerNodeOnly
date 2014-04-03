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
/*******
 * Connect to mongo database
 *******/
mongoose.connect('mongodb://localhost/media');
/*******
 * Set the Schema to create the collection
 *******/
var Media = mongoose.model('Media', MediaSchema);
/*******
 * Create server
 *******/
var server = http.createServer(function(req, res) {
    /*******
     * Listen for posts to /media
     *******/
    if (req.method === 'POST' && req.url.substr(0, 6) === '/media') {
        /*******
         * Parse querystring to object
         *******/
        var query = qs.parse(req.url.substr(7));
        /*******
         * Create unique ID for quick db search
         *******/
        var uniqueId = query.uid + query.nid;
        var media = new Media(req.body);
        /*******
         * Search for existing record by unique ID and update it
         * Upsert set to true so if no record is found it is created
         *******/
        Media.findOneAndUpdate({identifier: uniqueId},
            {
                nid:query.nid,
                uid:query.uid,
                identifier: uniqueId,
                time:query.time
            },
            {upsert: true},
            function (err) {
                if (err) return err;
        });
        res.writeHead(200);
        res.end();
    } else if (req.method === 'GET' && req.url.substr(0, 6) === '/media') {
        Media.find().lean().exec(function (err, docs) {
            if (err) {
                return err;
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(JSON.stringify(docs));
                if (req.url.substr(7) === 'drop') {
                    Media.remove({}, function (err) {
                        if (err) {
                            return err;
                        }
                        console.log('Media Dropped');

                    });
                }
            }
        });
    }
});

server.listen(3000);
console.log('Server listening on port 3000');