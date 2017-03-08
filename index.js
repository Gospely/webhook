var http = require('http');
var exec = require("shelljs").exec;

const PORT = 6603

console.log('listening port at: ' + PORT);

const cmds = {
  '/api/dev': 'ssh root@119.29.201.53 docker exec -d gospel_api npm install && git pull',
  '/api/build': 'docker exec -d gospel_api  git pull',
  '/admin': 'docker exec -d gospel_admin git pull',
  '/socket': 'cd /var/www/gospely/socket && git pull',
  '/index': 'cd /var/www/gospely/index && git pull',
  '/dash': 'docker exec -d gospel_dash git pull',
  '/ide': 'docker exec -d gospel_ide git pull',
  '/webhook': 'cd /var/www/gospely/webhook && git pull && pm2 restart index',
  '/deploy': 'cd /root/gospely/deploy && git pull',
  '/allocate': 'cd /root/gospely/allocate && git pull',
  '/vendor': 'cd /mnt/gospely/vendor && git pull',
  '/dodora_index': 'cd /var/www/dodora/index && git pull',
  '/test': 'echo "fuck"'
}

console.log(cmds);

var deployServer = http.createServer(function(request, response) {

  var inCMDs = false,
      cmd = '';

  for(var key in cmds) {
    if(key == request.url) {
      inCMDs = true;
      cmd = cmds[key];
      break;
    }
  }

  if(inCMDs) {

    exec(cmd, function(err, out, code) {
      if (err instanceof Error) {
        response.writeHead(500);
        response.end('Server Internal Error.');
        throw err
      }
      process.stderr.write(err.toString());
      process.stdout.write(out.toString());
      response.writeHead(200);
      response.end('Deploy Done.');
    })

  }else {
    response.writeHead(404)
    response.end('Invalid Deploy Request')
  }

})

deployServer.listen(PORT)
