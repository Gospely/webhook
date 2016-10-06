var http = require('http')
  , exec = require('exec')

const PORT = 6603

console.log('listening port at: ' + PORT);

var deployServer = http.createServer(function(request, response) {

  const cmds = {
    '/api': 'docker exec -d gospel_api cd /var/www/api && git pull',
    '/admin': 'docker exec -d gospel_admin cd /usr/share/nginx/html && git pull',
    '/socket': 'cd /var/www/gospely/socket && git pull',
    '/index': 'cd /var/www/gospely/index && git pull',
    '/dash': 'docker exec -d gospel_dash cd /var/www/dash && git pull',
    '/ide': '',
    '/webhook': 'cd /var/www/gospely/webhook && git pull'
  }

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
        response.writeHead(500)
        response.end('Server Internal Error.')
        throw err
      }
      process.stderr.write(err)
      process.stdout.write(out)
      response.writeHead(200)
      response.end('Deploy Done.')
    })

  }else {
    response.writeHead(404)
    response.end('Invalid Deploy Request')
  }

})

deployServer.listen(PORT)