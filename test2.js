var http = require('http');
var fs = require('fs');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var util = require('util');

//要抓取的网址，这里只能抓取这个url
var url = "http://cnodejs.org/"

//抓取的方法
function getu(url, op, op2){
	//抓取
    http.get(url , function(res){
	    //保存抓取信息
        var stack = '';
	
	    //设置编码
        res.setEncoding('binary');

	    //拼接抓取数据
        res.on('data' , function(d){
            stack += d; 
        }).on('error',function(err){
		//如果出错就输出
            console.log(err.message);
        });

	    //抓取结束
        res.on('end' , function(){
	        //设置编码
            var buf = new Buffer(stack ,'binary');

	        //转换编码
            var dat = iconv.decode(buf , 'utf-8') + "<br/>"; 

	        //把抓取的结果保存到文件里面
            fs.writeFile('source.txt', dat, function (err) {
                if (err){
                    console.log('write source' + err);
                };
            });

	        if(op == '1'){
                //调用拼接方法
                sp(stack);
            }else if(op == '2'){
                sp2(stack, op2);
            }
        }).on('error',function(err){
            console.log(err.message);
        })
    }).on('error', function(err){
        console.log(err.message);
    });
}

//拼接抓取到数据里面有用的信息
function sp(cont){
	//加载整个文档，也就是上面抓取到的数据
	$ = cheerio.load(cont);

	//获取首页有多少个帖子
    var count = $('div.topic_wrap').length;

	//用于拼接有用数据
    var data = '';

	//循环获取并处理
    for(var i=0;i<count;i++){
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

        var ds = getu(href, '2', data);

        console.log('reply data : ' + ds);

        data = '';

    }
}

//拼接抓取到数据里面有用的信息
function sp2(cont, data){
    //加载整个文档，也就是上面抓取到的数据
    $ = cheerio.load(cont);

    //获取首页有多少个replay
    var count = $('div.reply_item').length;

    //用于拼接有用数据

    console.log('reply : ' + count);

    //循环获取并处理
    for(var i=0;i<count;i++){

        //console.log('readCont 2 i: ' + i);

        //获取帖子的链接
        var ct2 = $('div.markdown-text').eq(i).html();

        var buf2 = new Buffer(ct2 ,'binary');
        data += iconv.decode(buf2 , 'utf-8'); 
    }

    //把数据写入到爬虫的文件上
      fs.appendFile('spider.txt', data, function (err) {
        if (err){
            console.log('write splid :' + err);
        };
        console.log('OK');
      });

}

//创建服务器
http.createServer(function(request, response) {
	//调用抓取方法
    getu(url, '1', '');

	//存储数据
    var da = "";



    //都去样式文件
    fs.readFile('style.css', 'utf-8', function (err, cs) {
      if (err){
            console.log('read style :' + err);
      };

      da += cs;

      //都去爬虫结果文件
        fs.readFile('spider.txt', 'utf-8', function (err, data) {
          if (err){
                console.log('read splid :' + err);
          };

          da += data;

          response.writeHead(200, {"Content-Type": "text/html", "charset": "utf-8"});
          response.write(da);
          response.end();
        });
    });

	
    
}).listen(3000);
