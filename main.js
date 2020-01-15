var http = require('http');
var fs = require('fs');
var url = require('url');
var qs=require('querystring');

function templateHTML(title, list, body, control){ //틀
  return`
 <!doctype html>
 <html>
 <head>
   <title>WEB1 - ${title}</title>
   <meta charset="utf-8">
 </head>
 <body>
   <h1><a href="/">WEB</a></h1>
   ${list}
   ${control}
   ${body}
 </body>
 </html>
 `;
}
function templateList(filelist){
    var list='<ul>';
    var i=0;
    while(i<filelist.length){
      list=list+`<li><a href ="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i=i+1;
    }
    list=list+'</ul>';
    return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname=url.parse(_url,true).pathname;
    if(pathname==='/') //home 페이지
    {
      if(queryData.id===undefined) //없는 값을 호출하려고 하는 경우 -> home
      {
        fs.readdir('./data', function(error,filelist){
          var title='Welcome';
          var description='Hello Node.js';
          var list=templateList(filelist);
          var template =templateHTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200); //응답
          response.end(template);
        })
      }
      else { //query.id를 data 에서 가져옴
        fs.readdir('./data', function(error,filelist){
          fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
          var title=queryData.id;
          var list=templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>
          <a href="/update?id=${title}">update</a>
          <form action="/delete_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <input type="submit" value="delete">
          <form>`
        );
          response.writeHead(200); //응답
          response.end(template);
          });
        });
      }
    }
      else if(pathname==='/create'){
        fs.readdir('./data', function(error,filelist){
          var title='Web-create';
          var list=templateList(filelist);
          var template =templateHTML(title, list, `
            <form action = "/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
            </form>
            `);
          response.writeHead(200); //응답
          response.end(template);
        })
      }
      else if(pathname==='/create_process'){
        //post방식에 대한 처리
          var body= '';
          request.on('data',function(data){
            //callback이 실행될떄마다 호출 data를 추가
            body=body+data;
          });
          request.on('end',function()
          {
            //데이터를 더이상 받을 수 없을 때 -> 정보 수신이 끝남
            var post=qs.parse(body);
            var title=post.title;
            var description=post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
        }
        else if(pathname==='/update')
        {
          fs.readdir('./data', function(error,filelist){
            fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
            var title=queryData.id;
            var list=templateList(filelist);
            //id는 data에 있는 값 -> 수정 이전 값 (변하면 data에서 못찾아)
            //title은 수정이후 내용을 담음
            var template = templateHTML(title, list,
              `
              <form action = "/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"}></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
              </form>
              `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
            response.writeHead(200); //응답
            response.end(template);
            });
          });
        }
        else if(pathname==='/update_process'){
            var body= '';
            request.on('data',function(data){
              //callback이 실행될떄마다 호출 data를 추가
              body=body+data;
            });
            request.on('end',function()
            {
              //데이터를 더이상 받을 수 없을 때 -> 정보 수신이 끝남
              var post=qs.parse(body);
              var id=post.id;
              var title=post.title;
              var description=post.description;
              fs.rename(`data/${id}`, `data/${title}`, function(err){
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                  response.writeHead(302, {Location: `/?id=${title}`});
                  response.end();
                })
            });
          });
        }
        else if(pathname==='/delete_process'){
            var body= '';
            request.on('data',function(data){
              //callback이 실행될떄마다 호출 data를 추가
              body=body+data;
            });
            request.on('end',function()
            {
              //데이터를 더이상 받을 수 없을 때 -> 정보 수신이 끝남
              var post=qs.parse(body);
              var id=post.id;
              fs.unlink(`data/${id}`, function(error){
                response.writeHead(302, {Location: `/`});
                response.end();
              })
          });//request.on })
        }

        else {
          response.writeHead(404); //실패시 약속된 번호
          response.end('Not found');
        }

});
app.listen(3000);
