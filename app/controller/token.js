'use strict';

const createRule = {
  user_name: {
    type: 'string',
    required: true,
  },
  password: {
    type: 'password',
    required: true,
    allowEmpty: false,
    min: 4,
  },
};

const Controller = require('../core/api_controller');
class TokenController extends Controller {

  async create() {
    try {
      this.ctx.validate(createRule);

      const name = this.ctx.request.body.user_name;
      const user = await this.ctx.model.User.findOne({
        user_name: name,
      });
      if (!user) {
        return this.error('用户不存在！');
      }
      if (user.password !== this.encryption(this.ctx.request.body.password)) {
        return this.error('密码错误！');
      }

      const now = Date.now() + '';
      const token = this.encryption(name + now);
      // const auth = this.encryption(name);

      await this.app.redis.set(token, user.id, 'EX', 7 * 24 * 60 * 60 * 1000);
      this.ctx.cookies.set('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        // domain: this.ctx.get('Origin')
      });
      // this.ctx.cookies.set('auth', auth, {
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      //   httpOnly: false,
      //   secure: false,
      //   // domain: this.ctx.get('Origin')
      // });
      // this.ctx.set('Access-Control-Allow-Origin', this.ctx.get('Origin'));
      // this.ctx.set('Access-Control-Allow-Credentials', true);
      // this.ctx.set('Access-Control-Allow-Headers', 'Content-Type, Set-Cookie, *');
      // this.ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS');
      return this.success({
        token,
        msg: '登录成功',
      });
    } catch (err) {
      console.log(err);
      this.error('登录失败！');
    }
  }

  async destroy() {
    const data = this.ctx.request.body;
    // const token = this.ctx.cookies.get('token');
    const token = data.token;
    if (!token) {
      return this.success('登出成功');
    }
    try {
      await this.app.redis.del(token);
      // this.ctx.cookies.delete('token');
      return this.success('登出成功');
    } catch (err) {
      console.log(err);
      return this.error('登出失败！');
    }
  }

}
module.exports = TokenController;
