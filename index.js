'use strict';

var logger = require('./lib/logger'),
    Browser = require('./lib/browser'),
    scanner = require('./lib/scanner'),
    argv = require('minimist')(process.argv.slice(2));

if(!argv.h && !argv.host) throw new Error('No host was specified with -h');

var cleanUpOnExit = function(){
  Browser.exitAll();
  process.exit(0);
};

process
.on('SIGHUP',  cleanUpOnExit)
.on('SIGINT',  cleanUpOnExit)
.on('SIGQUIT', cleanUpOnExit)
.on('SIGABRT', cleanUpOnExit)
.on('SIGTERM', cleanUpOnExit);

scanner.scanPage((argv.h || argv.host).trim())
  .then(function(results){
    var item = results.page.meta;
    logger.info(item);
    cleanUpOnExit();
  })
  .catch(function(err){
    logger.error({error: err.toString(), message: err.message, stack: err.stack })
  })
  .done();
