const appid = 'wxf16ffd378403b525';
const appsecret = '36ca5e29704e3f0b68a6beeb4aa43798';

const https = require('https');
const express = require("express");
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const app = express();
let http = require("http");
let fs = require("fs");
let path = require("path");
let template = require("art-template");
let url = require("url");

app.engine('html', require('express-art-template'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get("/", (req, res) => {
  // console.log(req.query);
  // 校验省略
  res.send(req.query.echostr);
});

app.get("/video", (req, res) => {
  console.log(req.query);
  console.log(appid);

  fetch(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${appsecret}&code=${req.query.code}&grant_type=authorization_code`)
    .then(r => r.json())
    .then(json => {
      console.log("access_token",json);
      
      return fetch(`https://api.weixin.qq.com/sns/userinfo?access_token=${json.access_token}&openid=${json.openid}&lang=zh_CN`);
    })
    .then(r => r.json())
    .then(json => {
      // console.log(json);
      console.log("userinfo",json);
      res.render("video.html", {
        comments: JSON.stringify(json)
      });
    });
});


// app.get("/", (req, res) => {
//   res.render("home.html",{
//     comments: comments
//   });
// });
app.use("/public", express.static(path.join(__dirname, "public")));

app.listen(80, () => {
  console.log("启动成功");
});

// console.log("http");
// let comments = [
//   {
//     name: "wsf",
//     content: "1111111111111111111111111111111111111",
//     time: "2019-01-01 00:00:00"
//   },
//   {
//     name: "wsf",
//     content: "22222",
//     time: "2019-01-01 00:00:00"
//   },
//   {
//     name: "wsf",
//     content: "333333333333333333",
//     time: "2019-01-01 00:00:00"
//   },
//   {
//     name: "wsf",
//     content: "4444444444444444444444444444444444444444444",
//     time: "2019-01-01 00:00:00"
//   },
//   {
//     name: "wsf",
//     content: "555555555555555555555555555555555555555",
//     time: "2019-01-01 00:00:00"
//   }
// ];

// http
//   .createServer((request, response) => {
//     // 解析url
//     const urlObj = url.parse(request.url, true);
//     if (urlObj.pathname === "/") {
//       fs.readFile(path.join(__dirname, "./views/home.html"), (err, data) => {
//         if (err) {
//           response.end("404 Not Found");
//           return;
//         }
//         let result = template.render(data.toString(), {
//           comments: comments
//         });
//         response.end(result);
//       });
//     } else if (urlObj.pathname === "/add_comment") {
//       comments.push({
//         name: urlObj.query.name,
//         content: urlObj.query.content,
//         time: "2019-01-01 00:00:00"
//       });


//       // 重定向
//       response.statusCode=302;
//       response.setHeader('Location','/');
//       response.end();

//     } else if (urlObj.pathname === "/post") {
//       fs.readFile(path.join(__dirname, "./views/post.html"), (err, data) => {
//         if (err) {
//           console.log("404 Not Found");
//           return;
//         }
//         response.end(data);
//       });
//       //处理静态资源
//     } else if (urlObj.pathname.startsWith("/public")) {
//       fs.readFile(path.join(__dirname, `.${request.url}`), (err, data) => {
//         if (err) {
//           console.log("404 Not Found");
//           return;
//         }
//         response.end(data);
//       });
//     } else {
//       fs.readFile(path.join(__dirname, "./views/404.html"), (err, data) => {
//         if (err) {
//           response.end("404");
//           return;
//         }
//         response.end(data);
//       });
//     }
//   })
//   .listen(80, (err, data) => {
//     console.log("启动成功");
//   });
