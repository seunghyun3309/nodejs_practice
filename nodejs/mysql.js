var mysql      = require('mysql');
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다.
var connection = mysql.createConnection({
  host     : 'localhost',//같은 컴퓨터에 있어
  user     : 'root',
  password : '111111',
  database : 'class'
});

connection.connect();//접속이 되었음을알림
  // sql 결과를 실행
connection.query('SELECT * FROM student', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});

connection.end();
