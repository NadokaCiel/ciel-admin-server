const Service = require('egg').Service;

class UserService extends Service {
  async find(userId) {
    let id;
    if (!userId) {
      let token;
      if (this.ctx.request.method === 'GET') {
        token = this.ctx.request.query.token;
      } else {
        token = this.ctx.request.body.token;
      }
      if (!token) {
        return null;
      }
      id = await this.app.redis.get(token);
    } else {
      id = userId;
    }

    if (!id) {
      return null;
    }

    const user = await this.ctx.model.User.findOne({
      id,
    }).select('-password');

    if (!user) {
      return null;
    }

    return user;
  }

  async save(params) {
    const user = await this.find(params.id);
    if (user) return false;
    const new_user = new this.ctx.model.User(params);
    new_user.id = await this.service.ids.getId('user_id');
    await new_user.save();
    return new_user;
  }

  async updateCcoin(params) {
    const user = await this.ctx.model.User.findOneAndUpdate({
      id: params.id,
    }, {
      signed: true,
      ccoin: params.ccoin,
      update_time: Date.now(),
    }, {
      new: true,
    }).select('-password');
    return user;
  }
}

module.exports = UserService;