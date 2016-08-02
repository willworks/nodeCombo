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
  home: 'index.html',
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
	responseFile : function (pathName, request, response) {
		UTIL.log(pathName);
		// TODO fs async
		response.end();
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
			self.responseFile(pathName, request, response);
		});
	}
};

HTTP.init();
