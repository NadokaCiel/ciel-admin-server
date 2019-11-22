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
    const redis_token = await ctx.app.redis.get(token);
    if (!redis_token) {
      ctx.body = {
        retcode: 40000,
        status: 'unauthorized',
        msg: '请登录后再进行操作。',
      };
      return;
    }
    await next();

  };
};
