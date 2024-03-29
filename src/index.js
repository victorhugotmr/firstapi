const http = require('http');
const { URL } = require('url');

const bodyParser = require('./helpers/bodyParser');
const routes = require('./routes');

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:3000${request.url}`)

  let { pathname } = parsedUrl;

  let id = null;

  const splitEndpont = pathname.split('/').filter(Boolean);
  
  if (splitEndpont.length > 1) {
    pathname = `/${splitEndpont[0]}/:id`
    id = splitEndpont[1];
  }

  console.log(`Request method: ${request.method} | Endpoint: ${parsedUrl.pathname}`)

  const route = routes.find((routeObj) => (
    routeObj.endpoint === pathname && routeObj.method === request.method
  ));

  if (route) {
    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(body))
    };

    if (['POST', 'PUT'].includes(request.method)) {
      bodyParser(request, () => route.handler(request, response))
    } else {
      route.handler(request, response);
    }

  } else {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`)
  }
  
});

server.listen(3000, () => console.log('🔥 Server started at http://localhost:3000'))