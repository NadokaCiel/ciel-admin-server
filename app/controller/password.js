'use strict';

const updateRule = {
  o_password: {
    type: 'password',
    required: true,
    allowEmpty: false,
    min: 4,
  },
  n_password: {
    type: 'password',
    required: true,
    allowEmpty: false,
    min: 4,
  },
};

const Controller = require('../core/api_controller');
class PasswordController extends Controller {

  async update() {
    try {
      this.ctx.validate(updateRule);

      const data = this.ctx.request.body;

      if (data.o_password === data.n_password) {
        return this.error('新密码不能与旧密码一致');
      }

      // const token = this.ctx.cookies.get('token');
      const token = data.token;

      if (!token) {
        return this.unauthorized();
      }

      const id = await this.app.redis.get(token);

      if (!id) {
        return this.unauthorized();
      }

      const user = await this.ctx.model.User.findOne({
        id,
      });

      if (!user) {
        return this.error('用户不存在');
      }

      if (user.role === 'visitor') {
        return this.error('不能更改游客的密码');
      }

      if (user.password !== this.encryption(data.o_password)) {
        return this.error('密码错误');
      }

      const now = Date.now() + '';
      const n_token = this.encryption(user.user_name + now);
      // const auth = this.encryption(user.user_name);
      await this.app.redis.del(token);
      await this.app.redis.set(n_token, id, 'EX', 7 * 24 * 60 * 60 * 1000);
      // this.ctx.cookies.set('token', n_token, {
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      //   httpOnly: true,
      //   secure: false,
      // });
      // this.ctx.cookies.set('auth', auth, {
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      //   httpOnly: false,
      //   secure: false,
      // });
      user.password = this.encryption(data.n_password);
      await this.ctx.model.User.findOneAndUpdate(id, user, {
        new: true,
      }).select('-password');
      await this.success('密码修改成功');
    } catch (err) {
      this.logger.error(err);
      return this.error('密码修改失败');
    }
  }

}
module.exports = PasswordController;
