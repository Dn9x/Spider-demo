var async = require('async');

async.series([
  function(next) { 
    console.log('this is step1');

    next();
  },
  function(next) { 
    console.log('this is step2');

    next();
  },
  function(next) { 
    console.log('this is step3');
    
    next();
  }
], function(err, values) {
    console.log('last step' + values);
});  