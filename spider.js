var http = require('http');
var fs = require('fs');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var util = require('util');
var models = require('./model/db'),
  Tits = models.Tits;

//要抓取的网址，这里只能抓取这个url
//var url = "http://cnodejs.org/?page="

exports.get = function(url, callback){
        console.log('url : %s', url);
    //抓取
    http.get(url , function(res){
        //保存抓取信息
        var stack = '';

        var j = 0;

        //设置编码
        res.setEncoding('binary');

        //拼接抓取数据
        res.on('data' , function(d){
            stack += d; 

            console.log('J: %s', j);

            j++;
        }).on('error',function(err){
            //如果出错就输出
            console.log(err.message);
        }).on('end', function(){
            sp(stack);
        });
    }).on('error', function(err){
        console.log(err.message);
    });
};

//拼接抓取到数据里面有用的信息
function sp(cont){
	//加载整个文档，也就是上面抓取到的数据
	$ = cheerio.load(cont);

	//获取首页有多少个帖子
    var count = $('div.topic_wrap').length;

	//用于拼接有用数据
    var data = '';

    console.log('count %s', count);

	//循环获取并处理
    for(var i=0;i<count;i++){
        console.log('i : ' + i);

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

        save(tit, href, tim, i);
    }
}

function save(tit, href, tim, i){
    var title = new Tits({title: tit, href: href, replys: 0, times: tim});

    title.save(function(err){
        if(err){
            console.log('error: %s', err);
        }

        console.log('%s title save success', i);
    });
}