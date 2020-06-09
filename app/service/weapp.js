const Service = require('egg').Service;

class WeappService extends Service {
  async token() {
    try {
      const access_token = await this.ctx.app.redis.get('access_token');
      if (access_token) return access_token;

      const result = await this.ctx.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.app.config.appId}&secret=${this.app.config.appSecret}`, {
        dataType: 'json',
      });
      const { data } = result;

      await this.app.redis.set("access_token", data.access_token, 'EX', data.expires_in / 2);
      return data.access_token;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  async qrcode(opt = {
    scene: "",
  }) {
    try {
      const token = await this.token();
      const result = await this.ctx.curl(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token}`, {
        method: 'POST',
        contentType: 'json',
        data: {
          scene: opt.scene,
          page: opt.page,
        },
        // dataType: 'json',
      });
      const image = await this.service.image.save(opt.scene, '/qrcode', result.data)
      return image;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  async openid(token) {
    try {
      let ticket = token;
      if (!ticket) {
        ticket = this.ctx.request.body.ticket;
      }
      if (!ticket) {
        return {
          retcode: 41000,
          msg: 'ticket已失效',
        }
      }
      const openid = await this.app.redis.get(ticket + 'openid');
      if (!openid) {
        return {
          retcode: 41000,
          msg: 'ticket已失效',
        }
      }
      return openid;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}

module.exports = WeappService;