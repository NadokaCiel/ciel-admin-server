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
  router.put('article', '/api/article/:id/status', checkLogin, 'article.status');

  router.resources('image', '/api/image', checkLogin, 'image');
  router.post('image', '/api/upload', 'image.upload');

  // 宠物系统相关
  router.resources('petType', '/api/petType', checkLogin, 'petType');
  router.post('petType', '/api/freezePetType/:id', checkLogin, 'petType.freeze');
  router.post('petType', '/api/unfreezePetType/:id', checkLogin, 'petType.unfreeze');

  /** ———— 问卷相关 ———— **/
  router.resources('subject', '/api/subject', checkLogin, 'quiz.subject');
  router.get('subject', '/api/subjectOption', 'quiz.subject.option');
  router.resources('quiz', '/api/quiz', checkLogin, 'quiz.quiz');
  router.put('quiz', '/api/quiz/:id/status', checkLogin, 'quiz.quiz.status');
  router.put('quiz', '/api/quiz/:id/qrcode', checkLogin, 'quiz.quiz.qrcode');
  /** ———— 问卷相关 END ———— **/

  /** ———— 游戏相关 ———— **/
  // 物品系统相关
  router.resources('item', '/api/item', checkLogin, 'item.item');
  router.get('item', '/api/itemOption', 'item.item.option');
  router.resources('item-type', '/api/itemType', checkLogin, 'item.type');
  router.resources('item-quality', '/api/quality', checkLogin, 'item.quality');

  // 职业相关
  router.resources('class', '/api/class', checkLogin, 'enum.class');
  router.get('class', '/api/classOption', 'enum.class.option');

  // 种族相关
  router.resources('race', '/api/race', checkLogin, 'enum.race');
  router.get('race', '/api/raceOption', 'enum.race.option');
  /** ———— 游戏相关 END ———— **/

  /** ———— 小程序相关 ———— **/
  // 登录相关
  router.post('mini-ticket', '/mini/ticket', 'ticket.createTicket');

  // 文章相关
  router.post('mini-article', '/mini/article/list', checkTicket, 'miniapp.article.index');
  router.post('mini-article', '/mini/article/view/:id', checkTicket, 'miniapp.article.show');

  // 问卷相关
  router.post('mini-quiz', '/mini/quiz/list', checkTicket, 'miniapp.quiz.index');
  router.post('mini-quiz', '/mini/quiz/view/:id', checkTicket, 'miniapp.quiz.show');
  router.post('mini-quiz', '/mini/quiz/correct/:id', checkTicket, 'miniapp.quiz.correct');
  /** ———— 小程序相关 END ———— **/

  app.use(serve({ rootDir: 'app/public', rootPath: '/public' }));
};
