var http = require('http');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

url = 'http://detail.zol.com.cn/332/331058/review.shtml'
function parseZOL(data)
{
    //console.log(data);
    var $ = cheerio.load(data);
    //console.log($('.star_overview .nums').text());
    $('.comment_content').each(function(){
        console.log('good: '+$(this).children('dl').children('.good').next().text());
        console.log('bad: '+$(this).children('dl').children('.bad').next().text());
    });
}
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
        var data = iconv.decode(buf , 'gbk');
        parseZOL(data);
    }).on('error',function(err){
        console.log(err.message);
    })
}).on('error', function(err){
    console.log(err.message);
});