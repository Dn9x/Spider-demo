var http = require('http');
var fs = require('fs');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var util = require('util');

//抓取的方法
exports.writeData = function(url, filename, callback){
    console.log('writeData 1 ');

    var dats = '';

	//抓取
    http.get(url , function(res){
        console.log('writeData 2 ');
	    //保存抓取信息
        var stack = '';
	
	    //设置编码
        res.setEncoding('binary');

	    //拼接抓取数据
        res.on('data' , function(d){
            stack += d; 

            console.log('writeData 3 ');
        }).on('error',function(err){
		//如果出错就输出
            console.log(err.message);
        });

	    //抓取结束
        res.on('end' , function(){
            console.log('writeData 4 ');
	        //设置编码
            var buf = new Buffer(stack ,'binary');

	        //转换编码
            var dat = iconv.decode(buf , 'utf-8') + "<br/>"; 

	        //把抓取的结果保存到文件里面
            fs.writeFile(filename, dat, function (err) {
                if (err){
                    console.log('write source' + err);
                };

                console.log('writeData 5 ');

                readData(dat);

                callback();
            });
        }).on('error',function(err){
            console.log(err.message);
        })
    }).on('error', function(err){
        console.log(err.message);
    });
}

//拼接抓取到数据里面有用的信息
function readData(cont){
    console.log('readData 1 ');

    //console.log('readData 1 cont:  ' + cont);

    //加载整个文档，也就是上面抓取到的数据
    $ = cheerio.load(cont);

    //获取首页有多少个帖子
    var count = $('div.topic_wrap').length;

    //用于拼接有用数据
    var data = '';

    //循环获取并处理
    for(var i=0;i<count;i++){
        console.log('readData 2 i=: ' + i);
        //获取帖子的链接
        var ct2 = $('div.topic_wrap a').eq(i).attr('href').replace('/topic/', 'http://cnodejs.org/topic/');
        var buf2 = new Buffer(ct2 ,'binary');
        var href = iconv.decode(buf2 , 'utf-8'); 
        
        //获取帖子的title
        var ct1 = $('div.topic_wrap a').eq(i).html();
        var buf = new Buffer(ct1 ,'binary');
        var tit = iconv.decode(buf , 'utf-8'); 

        //获取帖子的最新时间
        var ct3 = $('div.last_time').eq(i).text();
        var buf3 = new Buffer(ct3 ,'binary');
        var tim = iconv.decode(buf3 , 'utf-8'); 

        //重新拼接出一个div
        data += util.format('<div class="title"><a href="%s" target="_blank">%s</a>%s</div>', href, tit, tim);

        console.log('readData 3 ');
    }

    //把数据写入到爬虫的文件上
          fs.writeFile('spider.txt', data, function (err) {
            if (err){
                console.log('write splid :' + err);
            };
            console.log('appendFileSync splid : OK');
          });
}

//拼接抓取到数据里面有用的信息
exports.readCont = function(cont, callback){

    console.log('readCont 1 ');

    //加载整个文档，也就是上面抓取到的数据
    $ = cheerio.load(cont);

    //获取首页有多少个replay
    var count = $('div.reply_item').length;

    //用于拼接有用数据
    var data = '';

    //循环获取并处理
    for(var i=0;i<count;i++){

        console.log('readCont 2 i: ' + i);

        //获取帖子的链接
        var ct2 = $('div.reply_item').eq(i).html();
        var buf2 = new Buffer(ct2 ,'binary');
        data += iconv.decode(buf2 , 'utf-8'); 
    }

    console.log('readCont 3 ');

    callback(data);
}
