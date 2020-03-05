var http = require('http');
var url = require('url');

var topic = require('./lib/topic');
var author = require('./lib/author');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === '/') //home 페이지
  {
    if (queryData.id === undefined) //없는 값을 호출 -> home
    {
      topic.home(request, response);
    }
    else {
      topic.page(request, response);
    }
  }
  else if (pathname === '/create') {
    topic.create(request, response);
  }
  else if (pathname === '/create_process') {
    topic.create_process(request, response);
  }

  else if (pathname === '/update') {
    topic.update(request, response);
  }
  else if (pathname === '/update_process') {
    topic.update_process(request, response);
  }
  else if (pathname === '/delete_process') {
    topic.delete_process(request, response);
  }
  else if (pathname === '/author') {
    author.home(request, response);
  } else if (pathname === '/author/create_process') {
    author.create_process(request, response);
  } else if (pathname === '/author/update') {
    author.update(request, response);
  } else if (pathname === '/author/update_process') {
    author.update_process(request, response);
  } else if (pathname === '/author/delete_process') {
    author.delete_process(request, response);
  }

  else {
    response.writeHead(404); //실패시 약속된 번호
    response.end('Not found');
  }

});
app.listen(3000);
