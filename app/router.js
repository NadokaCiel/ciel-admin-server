'use strict';

const serve = require('koa-static-server')
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, middlewares } = app
	const checkLogin = middlewares.checkLogin()
	const checkTicket = middlewares.checkTicket()

	// 管理系统相关
	router.resources('user', '/api/user', checkLogin, 'user')
	router.post('user', '/api/user', 'user.createAccount')
	router.put('password', '/api/password', checkLogin, 'password.update')
	router.resources('token', '/api/token', 'token')

	router.resources('article', '/api/article', checkLogin, 'article')

	// 小程序相关
	router.post('mini-ticket', '/mini/ticket', 'ticket.createTicket')
	router.resources('mini-article-list', '/mini/article', checkTicket, 'article')
	
	app.use(serve({rootDir: 'app/public', rootPath: '/public'}))
};
