var http = require('http');
var fs = require('fs');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

var url = "http://cnodejs.org/"

function getu(){
    http.get(url , function(res){
        var stack = '';
        res.setEncoding('binary');

        res.on('data' , function(d){
            stack += d;
        }).on('error',function(err){
            console.log(err.message);
        });

        res.on('end' , function(){
            var buf = new Buffer(stack ,'binary');
            var dat = iconv.decode(buf , 'utf-8') + "<br/>"; 

            fs.writeFile('source.txt', dat, function (err) {
                if (err) throw err;
            });

            sp(stack);
        }).on('error',function(err){
            console.log(err.message);
        })
    }).on('error', function(err){
        console.log(err.message);
    });
}

function sp(cont){
	$ = cheerio.load(cont);

    var count = $('div.topic_wrap').length;

    var data = "";

    for(var i=0;i<count;i++){

        var ct2 = $('div.block').eq(i).text();
        var buf2 = new Buffer(ct2 ,'binary');
        data += iconv.decode(buf2 , 'utf-8') + "<br/>"; 
        
        var ct1 = $('div.topic_wrap').eq(i).text();
        var buf = new Buffer(ct1 ,'binary');
        data += iconv.decode(buf , 'utf-8') + "<br/>"; 

        var ct3 = $('div.last_time').eq(i).text();
        var buf3 = new Buffer(ct3 ,'binary');
        data += iconv.decode(buf3 , 'utf-8') + "<br/>"; 

        //console.log(data);
    }

    fs.writeFile('splid.txt', data, function (err) {
        if (err) throw err;
        console.log('OK');
    });
}

http.createServer(function(request, response) {
    getu();

    var da = "";

    fs.readFile('splid.txt', 'utf-8', function (err, data) {
      if (err) throw err;

      console.log('da:' + data);

      response.writeHead(200, {"Content-Type": "text/html", "charset": "utf-8"});
      response.write(data);
      response.end();
    });
    
}).listen(8888);

