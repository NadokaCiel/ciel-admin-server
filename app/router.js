'use strict';

const serve = require('koa-static-server');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, middlewares } = app;
  const checkLogin = middlewares.checkLogin();
  const checkTicket = middlewares.checkTicket();

  // 基础数据
  router.get('common', '/api/common', checkLogin, 'common.index');

  // 微博数据服务
  router.get('weibo', '/api/weibo', checkLogin, 'weibo.index');

  // 管理系统相关
  router.resources('user', '/api/user', checkLogin, 'user');
  router.post('user', '/api/user', checkLogin, 'user.createAccount');
  router.put('password', '/api/password', checkLogin, 'password.update');
  router.resources('token', '/api/token', 'token');

  router.resources('article', '/api/article', checkLogin, 'article');

  // 宠物系统相关
  router.resources('petType', '/api/petType', checkLogin, 'petType');
  router.post('petType', '/api/freezePetType/:id', checkLogin, 'petType.freeze');
  router.post('petType', '/api/unfreezePetType/:id', checkLogin, 'petType.unfreeze');

  // 小程序相关
  router.post('mini-ticket', '/mini/ticket', 'ticket.createTicket');
  router.resources('mini-article-list', '/mini/article', checkTicket, 'article');

  app.use(serve({ rootDir: 'app/public', rootPath: '/public' }));
};
