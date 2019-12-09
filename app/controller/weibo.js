'use strict';

const Controller = require('../core/api_controller');
class ArticleController extends Controller {

  async index() {
    try {
      const {
        query,
      } = this.ctx;

      const size = Number(query.size) || 10;
      const page = query.page || 1;

      const actor = await this.getUser(true);

      if (this.roleRank(actor.role) < 4 && actor.id != 6) {
        return this.error('权限不足：无法查看该微博内容');
      }

      const result = await this.ctx.curl(`https://api.weibo.com/2/statuses/home_timeline.json`, {
        method: 'GET',
        dataType: 'json',
        data: {
          access_token: this.app.config.weiboAuth,
          count: size,
          page,
        },
      });

      const data = result.data;

      // console.log('data', data);

      this.success(this.makeList(data.statuses || [], data.total_number || 0));
    } catch (err) {
      this.logger.error(err);
      this.error(err);
    }
  }

  // async index() {
  //   try {
  //     const {
  //       query,
  //     } = this.ctx;

  //     const size = Number(query.size) || 50;
  //     const page = query.page || 1;

  //     const result = await this.ctx.curl(`https://api.weibo.com/2/statuses/user_timeline.json`, {
  //       method: 'GET',
  //       dataType: 'json',
  //       data: {
  //         access_token: '2.00tOruICyVTjzCd193f50664vHUueB',
  //         count: size,
  //         page,
  //       },
  //     });

  //     const data = result.data;

  //     console.log('data', data);

  //     this.success(this.makeList(data.statuses || [], data.total_number || 0));
  //   } catch (err) {
  //     this.logger.error(err);
  //     this.error(err);
  //   }
  // }

}
module.exports = ArticleController;
