var db = require('./db');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');

exports.home = function (request, response) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
        var title = 'Welcome';
        var description = 'Hello Node.js';
        var list = template.List(topics);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
        response.writeHead(200); //응답
        response.end(html);
    });
}//module.js과 달리 여러개 제공

exports.page = function (request, response) {
    var url = require('url');
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function (error, topics) {
        if (error) {
            throw error;
        }
        //query.id를 data 에서 가져옴
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
            [queryData.id], function (error2, topic) {
                if (error2) {
                    throw error2;
                }
                //console.log(topic);
                var title = topic[0].title;
                var description = topic[0].description;
                var list = template.List(topics);
                var html = template.HTML(title, list,
                    `
               <h2>${sanitizeHtml(title)}</h2>
               ${sanitizeHtml(description)}
               <p>by ${sanitizeHtml(topic[0].name)}</p>
               `,
                    `<a href="/create">create</a>
                  <a href="/update?id=${queryData.id}">update</a>
                  <form action="/delete_process" method="post">
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                  </form>`
                );
                response.writeHead(200); //응답
                response.end(html);
            })
    });
}

exports.create = function (request, response) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
        db.query(`SELECT * FROM author`, function (error2, authors) {
            var title = 'CREATE';
            var list = template.List(topics);
            var html = template.HTML(sanitizeHtml(title), list,
                `<form action = "/create_process" method="post">
                   <p><input type="text" name="title" placeholder="title"></p>
                   <p>
                     <textarea name="description" placeholder="description"></textarea>
                   </p>
                   <p>
                     ${template.authorSelect(authors)}
                   </p>
                   <p>
                     <input type="submit">
                   </p>
                   </form>
                   `,
                `<a href="/create">create</a>`
            );
            response.writeHead(200); //응답
            response.end(html);
        });
    });
}

exports.create_process = function (request, response) {
    var qs = require('querystring');
    var body = '';
    //callback이 실행될떄마다 호출 data를 추가
    request.on('data', function (data) {
        body = body + data;
    });
    //데이터를 더이상 받을 수 없을 때 -> 정보 수신이 끝남
    request.on('end', function () {
        var post = qs.parse(body);
        db.query(`
              INSERT INTO topic (title, description, created, author_id)
              VALUES(?,?,NOW(),?)`,
            [post.title, post.description, post.author],
            function (error, result) {
                if (error) {
                    throw error;
                }
                response.writeHead(302, { Location: `/?id=${result.insertId}` });
                response.end();
            }
        )
    });
}

exports.update = function (request, response) {
    var url = require('url');
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * from topic`, function (error, topics) {
        if (error) {
            throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, topic) {
            if (error2) {
                throw error2;
            }
            db.query(`SELECT * FROM author`, function (error, authors) {
                var list = template.List(topics);
                var html = template.HTML(sanitizeHtml(topic[0].title), list,
                    `<form action = "/update_process" method="post">
                          <input type="hidden" name="id" value="${topic[0].id}">
                          <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"}></p>
                          <p>
                            <textarea name="description" placeholder="topic[0].description">${topic[0].description}</textarea>
                          </p>
                          <p>
                            ${template.authorSelect(authors, topic[0].author_id)}
                          </p>
                          <p>
                            <input type="submit">
                          </p>
                          </form>
                          `,
                    `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                );
                response.writeHead(200); //응답
                response.end(html);
            });
        });
    });
}

exports.update_process = function (request, response) {
    var qs = require('querystring');
    var body = '';
    request.on('data', function (data) {
        //callback이 실행될떄마다 호출 data를 추가
        body = body + data;
    });
    request.on('end', function () {
        //데이터를 더이상 받을 수 없을 때 -> 정보 수신이 끝남
        var post = qs.parse(body);
        db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
            [post.title, post.description, post.author, post.id],
            function (error, result) {
                response.writeHead(302, { Location: `/?id=${post.id}` });
                response.end();
            })
    });
}

exports.delete_process = function (request, response) {
    var qs = require('querystring');
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE id=?`, [post.id], function (error, result) {
            if (error) {
                throw error;
            }
            response.writeHead(302, { Location: `/` });
            response.end();
        });
    });
}
