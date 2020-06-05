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
      // console.log("---------------------------- token err ----------------------------");
      // console.log(err)
      this.logger.error(err);
      return null;
    }
  }

  async qrcode(opt = {
    scene: "",
  }) {
    try {
      const token = await this.token();
      // console.log("---------------------------- qrcode config ----------------------------");
      // console.log(opt)
      const result = await this.ctx.curl(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token}`, {
        method: 'POST',
        contentType: 'json',
        data: {
          scene: opt.scene,
          path: opt.page,
          // access_token: token,
        },
        // dataType: 'json',
      });
      // const result = await this.ctx.curl(`https://api.weixin.qq.com/wxa/getwxacode?access_token=${token}`, {
      //   method: 'POST',
      //   contentType: 'json',
      //   data: {
      //     path: `${opt.page}?${opt.scene}`,
      //     // access_token: token,
      //   },
      //   // dataType: 'json',
      // });
      // console.log("---------------------------- qrcode result ----------------------------");
      // console.log(result)
      // console.log("---------------------------- qrcode buffer ----------------------------");
      // console.log(result.data)
      // console.log(result.data.toString())
      const image = await this.service.image.save(opt.scene, '/qrcode', result.data)
      // console.log("---------------------------- qrcode image ----------------------------");
      // console.log(image)
      return image;
    } catch (err) {
      // console.log('---------------------------- qrcode err ----------------------------')
      // console.log(err)
      this.logger.error(err);
      return null;
    }
  }
}

module.exports = WeappService;