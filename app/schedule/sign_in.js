module.exports = {
  schedule: {
    // 每30秒执行一次
    // cron: '*/30 * * * * *',
    // 每天早上6点执行一次
    cron: '0 0 6 * * ?',
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    const list = await ctx.model.User.find();
    console.log('list: ', list);
    list.forEach(async (item) => {
      // console.log('item id: ', item.id);
      if (item.signed) {
        await ctx.model.User.findOneAndUpdate({
          id: item.id,
        }, {
          signed: false,
        }, {
          new: true,
        });
      } else {
        await ctx.model.Signin.findOneAndUpdate({
          user_id: item.id,
        }, {
          serial: 0,
        }, {
          new: true,
        });
      }
    });
    console.log("signin clear!");
  },
};