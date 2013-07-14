var spider = require('./test3');


for(var i=1; i<21; i++){

	var url = "http://cnodejs.org/?page="	+ i;

	spider.get(url, function(){
		console.log('url i : %s', url);
	});
}