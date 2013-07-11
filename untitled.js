

        Spider.writeData(href, 'temp1.txt', function(dat){
            console.log('readData 4 ');
            Spider.readCont(dat, function(dats){
                console.log('readData 5 ');
                data += dats;

                //都去样式文件
                fs.readFile('style.css', 'utf-8', function (err, cs) {
                  if (err){
                        console.log('read style :' + err);
                  };

                  console.log('readData 6 ');

                  //把样式拼接到数据上面
                  data += cs;

                  console.log(cs);

                  //把数据写入到爬虫的文件上
                  fs.writeFile('spider.txt', data, function (err) {
                    if (err){
                        console.log('write splid :' + err);
                    };

                    console.log('readData 7 ');

                    //console.log(data);
                    callback(data);
                  });
                });
            });
        });