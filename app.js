var http = require('http');
var fs = require('fs');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var util = require('util');

//yaasdsdfsdfasdfsdfsdfsdfsdf sdfasdfasdfdfasd sdfjassdfasdf asdfasdfadsf
var url = "http://cnodejs.org/"

function getu(){
    http.get(url , function(res){
        var stack = '';
        res.setEncoding('binary');

        res.on('data' , function(d){
            stack += d; nihao  nihao //asdfasdfnidfasdfninihao  nisdfasdfsdfadfasdfasdfsdfasdf
        }).on('error',function(err){
            console.log(err.message);
        });

        res.on('end' , function(){
            var buf = new Buffer(stack ,'binary');
            var dat = iconv.decode(buf , 'utf-8') + "<br/>"; 

            fs.writeFile('source.txt', dat, function (err) {
                if (err){
                    console.log('write source' + err);
                };
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

    var data = '';

    for(var i=0;i<count;i++){

        var ct2 = $('div.topic_wrap a').eq(i).attr('href').replace('/topic/', 'http://cnodejs.org/topic/');
        var buf2 = new Buffer(ct2 ,'binary');
        var href = iconv.decode(buf2 , 'utf-8'); 
        
        var ct1 = $('div.topic_wrap a').eq(i).html();
        var buf = new Buffer(ct1 ,'binary');
        var tit = iconv.decode(buf , 'utf-8'); 

        var ct3 = $('div.last_time').eq(i).text();
        var buf3 = new Buffer(ct3 ,'binary');
        var tim = iconv.decode(buf3 , 'utf-8'); 

        data += util.format('<div class="title"><a href="%s" target="_blank">%s</a>%s</div>', href, tit, tim);

        //data += '<div class="title">' + data + '</div>'; 

        //console.log(data);
    }

    fs.readFile('style.css', 'utf-8', function (err, cs) {
      if (err){
            console.log('read style :' + err);
      };

      console.log(cs);

      data += cs;

      fs.writeFile('spider.txt', data, function (err) {
        if (err){
            console.log('write splid :' + err);
        };
        console.log('OK');
      });
    });

    
}

http.createServer(function(request, response) {
    getu();

    var da = "";

    fs.readFile('spider.txt', 'utf-8', function (err, data) {
      if (err){
            console.log('read splid :' + err);
      };

      response.writeHead(200, {"Content-Type": "text/html", "charset": "utf-8"});
      response.write(data);
      response.end();
    });
    
}).listen(7777);

