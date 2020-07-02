'use strict';

module.exports = () => {
  return async (ctx, next) => {

    // const token = ctx.cookies.get('token');
    let token;
    if (ctx.request.method === 'GET') {
      token = ctx.request.query.token;
    } else {
      token = ctx.request.body.token;
    }
    if (!token) {
      ctx.body = {
        retcode: 40000,
        status: 'unauthorized',
        msg: '请登录后再进行操作。',
      };
      return;
    }
    const id = await ctx.app.redis.get(token);
    if (!id) {
      ctx.body = {
        retcode: 40000,
        status: 'unauthorized',
        msg: '请登录后再进行操作。',
      };
      return;
    }

    const user = await ctx.model.User.findOne({
      id,
    });

    if (!user) {
      ctx.body = {
        retcode: 44000,
        status: 'unauthorized',
        msg: '用户不存在',
      };
      return;
    }

    if (user.status === 'frozen') {
      ctx.body = {
        retcode: 43000,
        status: 'frozen',
        msg: '您的账户已被冻结，无法使用',
      };
      return;
    }

    await ctx.model.User.findOneAndUpdate({
      id,
    }, {
      visit_time: Date.now(),
    }, {
      new: true,
    });
    await next();

  };
};
