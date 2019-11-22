'use strict';

const createRule = {
  app_key: {
    type: 'string',
    required: true,
  },
  js_code: {
    type: 'string',
    required: true,
  },
};

const Controller = require('../core/api_controller');
class TicketController extends Controller {

  async createTicket() {
    try {
      this.ctx.validate(createRule);

      const js_code = this.ctx.request.body.js_code;

      const result = await this.ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${this.app.config.appId}&secret=${this.app.config.appSecret}&js_code=${js_code}&grant_type=authorization_code`, {
        dataType: 'json',
      });

      const data = result.data;

      // console.log('result', result);

      const now = Date.now() + '';
      const ticket = this.encryption(data.oepnid + now);

      await this.app.redis.set(ticket, data.session_key, 'EX', 7 * 24 * 60 * 60 * 1000);
      return this.success({
        openid: data.openid,
        unionid: data.unionid,
        ticket,
      });
    } catch (err) {
      console.log(err);
      this.error('登录失败', 41000);
    }
  }

}
module.exports = TicketController;
