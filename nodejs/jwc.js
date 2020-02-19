var net = require('net');
var http = require('http');
let https = require("https");
var querystring = require('querystring');
var md5 = require('./md5');

var httpPort = 7401;
var httpsPort = 7402;

net.createServer(function (socket) {
  socket.once('data', function (buf) {
    console.log(buf[0]);
    // https数据流的第一位是十六进制“16”，转换成十进制就是22
    var address = buf[0] === 22 ? httpsPort : httpPort;
    //创建一个指向https或http服务器的链接
    var proxy = net.createConnection(address, function () {
      proxy.write(buf);
      //反向代理的过程，tcp接受的数据交给代理链接，代理链接服务器端返回数据交由socket返回给客户端
      socket.pipe(proxy).pipe(socket);
    });
    proxy.on('error', function (err) {
      console.log(err);
    });
  });
  socket.on('error', function (err) {
    console.log(err);
  });
}).listen(7400);

// Configuare https
const httpsOption = {
  key: fs.readFileSync("./privkey.pem"),
  cert: fs.readFileSync("./fullchain.pem")
}

http.createServer(function (req, res) {
  // 重定向
  res.writeHead(301, {
    'Location': 'https://www.jasongzy.top:7400'
  });
  res.end();
}).listen(httpPort);

https.createServer(httpsOption, function (req, res) {
  //console.log('hello');
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
      res.write("<html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>请妥善保存链接</title></head><body>");
      res.write(" 免密登录链接：<br>" + "<a href=\"" + link + "\" target=\"_blank\">" + link + "</a>");
      res.write("</body></html>");
    }
    else {  // 输出表单
      res.end(fs.readFileSync('./jwc.html', 'UTF-8'))
    }
    res.end();
  });
}).listen(httpsPort);

console.log('Server running at http://0.0.0.0:7400/');
