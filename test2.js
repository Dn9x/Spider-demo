var http = require('http');
var fs = require('fs');
var util = require('util');
var spider = require('./test3');
var async = require('async');
var models = require('./model/db'),
  Tits = models.Tits;


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