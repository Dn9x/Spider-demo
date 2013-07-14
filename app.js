var http = require('http');
var fs = require('fs');
var util = require('util');
var spider = require('./test3');
var async = require('async');
var models = require('./model/db'),
  Tits = models.Tits;

//创建服务器
http.createServer(function(request, response) {

    //存储数据
    var da = "";

    async.series([
      function(next){
        for(var i=1; i<21; i++){
          var url = "http://cnodejs.org/?page=" + i;

          spider.get(url, function(){
            console.log('url i : %s', url);
          });
        }

        next();
      }, function(){
        //都去样式文件
        fs.readFile('style.css', 'utf-8', function (err, cs) {
          if (err){
                console.log('read style :' + err);
          };

          //把样式拼接到数据上面
          da += cs;

          //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的10个结果
          Tits.find({}).sort({_id: 'asc'}).exec(function(err, docs){
            if (err) {
              console.log('Tits find error: %s', err);
            }
            var i = 1;
            //解析 markdown 为 html
            docs.forEach(function(doc){
              da += util.format('<div class="title"><a href="%s" target="_blank">%s</a>%s  %s</div>', doc.href, doc.title, doc.times, i);

              i++;
            });

            response.writeHead(200, {"Content-Type": "text/html", "charset": "utf-8"});
            response.write(da);
            response.end();

          });
        });
      }], function(err, values) {
      console.log('slslsl : ' + values);
    });

	//调用抓取方法
    
    
}).listen(3000);
