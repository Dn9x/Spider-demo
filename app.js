var http = require('http');
var fs = require('fs');
var Spider = require('./spider');

//要抓取的网址，这里只能抓取这个url
var url = "http://cnodejs.org/"

//创建服务器
http.createServer(function(request, response) {

    //存储数据
    var da = "";

	//调用抓取方法
    Spider.writeData('http://cnodejs.org/', 'temp.txt', function(){
        //都去样式文件
        fs.readFile('style.css', 'utf-8', function (err, cs) {
          if (err){
                console.log('read style :' + err);
          };

          //把样式拼接到数据上面
          da += cs;

          //都去爬虫结果文件
            fs.readFile('spider.txt', 'utf-8', function (err, data) {
              if (err){
                    console.log('read splid :' + err);
              };

              da += data;

              console.log(da);

              response.writeHead(200, {"Content-Type": "text/html", "charset": "utf-8"});
              response.write(da);
              response.end();
            });

        });       
    });
    
}).listen(3000);
