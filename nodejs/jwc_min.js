var http = require('http');
var querystring = require('querystring');
var md5 = require('./md5');

var postHTML =
  '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title> 教务处免密登录链接生成 </title></head>' +
  '<body>' +
  '<form method="post">' +
  ' 学号： <input name="id"><br>' +
  ' 密码： <input name="pw" type="password"><br>' +
  '<input type="submit">' +
  '</form>' +
  '</body></html>';

http.createServer(function (req, res) {
  var POST = "";
  req.on('data', function (chunk) {
    POST += chunk;
  });
  req.on('end', function () {
    // 解析参数
    POST = querystring.parse(POST);
    // 设置响应头部信息及编码
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
    if (POST.id && POST.pw) {
      var link = "http://202.119.81.112:9080/njlgdx/xk/LoginToXk?method=verify&USERNAME=" + POST.id.toUpperCase() + "&PASSWORD=" + md5(POST.pw).toUpperCase()
      res.write(" 免密登录链接：" + "<a href=\"" + link + "\" target=\"_blank\">" + link + "</a>");
    } else {  // 输出表单
      res.write(postHTML);
    }
    res.end();
  });
}).listen(7400);

console.log('Server running at http://0.0.0.0:7400/');
