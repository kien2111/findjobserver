var path = require('path');

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var dir = path.join(__dirname.replace("controller",""),'image');
var mime = {
    html:'text/html',
    txt:'text/plain',
    gif:'image/gif',
    jpg:'image/jpg',
    png:'image/jpg',
    svg:'image/svg',
    json:'application/json'
}

exports.serveImage =(req,res)=>{
    let filepath = path.join(dir,req.path);
    if(filepath.indexOf(dir+path.sep)!=0){
        return res.status(403).end('Forbidden');
    }
    let type = mime[path.extname(filepath).slice(1)] || 'application/json';
    let stream = fs.createReadStream(filepath);
    stream.on('open',()=>{
        res.set('Content-type',type);
        stream.pipe(res);
    });
    stream.on('data',(chunk)=>{
        console.log(chunk);
    });
    stream.on('error',()=>{
        res.set('Content-type',mime['json']);
        res.status(404).end();
    });
};