module.exports = () => {
  return async (ctx, next) => {

    let ticket;
    if (ctx.request.method === 'GET') {
      ticket = ctx.request.query.ticket;
    } else {
      ticket = ctx.request.body.ticket;
    }
    if (!ticket) {
      ctx.body = {
        retcode: 41000,
        status: 'unauthorized',
        msg: '请登录后再进行操作。',
      };
      return;
    }
    const redis_ticket = await ctx.app.redis.get(ticket);
    if (!redis_ticket) {
      ctx.body = {
        retcode: 41000,
        status: 'unauthorized',
        msg: '请登录后再进行操作。',
      };
      return;
    }
    await next();

  };
};
