'use strict';
// 爬虫？
// 通过http模块，代码执行http协义,
// 拿到网页内容,分析网页，拿到想要的。
// require 引入http模块
var http = require('http'),
    // 向url 发出http请求
    https = require('https'),
    path = require('path'),
    // node 后端， 服务器，文件系统
    fs = require('fs'),
    cheerio = require('cheerio');
// 从请求，响应，到分析，再到文件保存
// 配置
var opt = {
    // URL  子域名 路由  端口
    hostname: 'movie.douban.com',
    path: '/top250',
    port: 80
}
// 发出请求
const url =
`https://${opt.hostname}${opt.path}?start=0`;
https.get(url, function(res) {
    // 二进制流
    // res.setEncoding('utf-8');
    // 数据包到达 chunk 这个二进制块
    // on data 事件
    var html = '';
    var movies = [];
    res.on('data', function(chunk) {
        html += chunk;
    })
    // 发送结束
    res.on('end', function() {
        // console.log(html);
        // cheerio 将html字符串在
        // 命令行，显示出DOM的库
        var $ = cheerio.load(html);
        $('.item').each(function() {
            var picUrl = $('.pic img', this).attr('src');
            console.log(picUrl);
            var movie = {
              picUrl,
              title: $('.title',this).text(),
              star: $('.info .star .rating_num',this).text(),
              link:$('a',this).attr('href')
            }
            movies.push(movie);
            // downloadImg('./img/', picUrl);
        })
        saveData('./data/1.json',movies);
    })
})
function saveData(dataDir,data){
  fs.writeFile(dataDir,JSON.stringify(data));
}
function downloadImg (imgDir, url) {
    https.get(url, function (res) {
        var data = "";
        // 图片是二进制流
        res.setEncoding('binary');
        res.on('data', function(chunk) {
            data += chunk;
        })
        res.on('end', function() {
            // 文件模块
            fs.writeFile(imgDir +
                 path.basename(url), data, 'binary',
                  function(err){
                    if(err) {
                        console.log('文件保存失败');
                        return;
                    }
                    console.log('Image downloaded:',
                     path.basename(url));
                 })
        })
    })
}
