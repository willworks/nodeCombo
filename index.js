/**
 * scnuzhonghanjin@gmail.com
 */
'use strict'

/**
 * [require modules]
 * @type {[type]}
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

/**
 * [params description]
 * @type {[type]}
 */
let CONFIG = {};
let HTTP = {};
let UTIL = {};

CONFIG = {
  home: 'index.js',
  assets: './assets/',
  port: 9876
};

UTIL = {
	log : function (msg) {
		console.log(msg);
	}
};

HTTP = {
	init : function () {
		this.createServer();
	},

	setResHeader: function (response) {
		response.setHeader('Content-Type', 'text/js');
		response.writeHead(200, {'Content-Type': 'text/js'});
	},
	
	readFileAsyncPromise : function (filePos) {
		return new Promise(function (resolve, reject) {
			// 异步读取
			fs.readFile(filePos, function (err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	},

	responseFile : function (pathName, request, response) {
		let that = this;
		let assetsArr = request.url.split('??')[1].split(',');
		let resData = '';
		for (let i in assetsArr) {
			UTIL.log(assetsArr[i]);
			this.readFileAsyncPromise(CONFIG.assets + 'seajs/' + assetsArr[i])
				.then(function (data) {
					UTIL.log(data.toString());
					resData += data.toString();
					// 最终全部返回结果
					if (i == assetsArr.length-1) {
						that.setResHeader(response);
						response.end(resData);
					}
				})
				.catch(function (err) {
					UTIL.log(err.toString());
				});
		}
	},

	createServer : function () {
		let server = http.createServer();
		server.listen(CONFIG.port!==0 ? CONFIG.port : 0);
		this.bindEvents(server);
	},

	bindEvents:function (server){
		let self = this;

		// 注册监听端口启用事件
		server.on('listening', function () { 
			let port = server.address().port;
			UTIL.log('Server running at '+ port);
		})

		// 注册请求处理事件
		server.on('request', function (request, response) {
			let pathName = url.parse(request.url).pathname.slice(1);
			if (pathName == 'favicon.ico') {
				// 阻止浏览器的默认favicon请求
				return;
			} else {
				self.responseFile(pathName, request, response);
			}
		});
	}
};

HTTP.init();
