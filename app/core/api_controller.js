const { Controller } = require('egg');
const crypto = require('crypto');

class ApiController extends Controller {
  async repackList(modelName, select, getAll) {

    const {
      query,
      model,
    } = this.ctx;

    const size = Number(query.size) || 10;
    const page = query.page || 1;
    const offset = Number((page - 1) * size);
    let filter = select || '';

    if (!getAll) {
      filter += ' -_id -__v';
    }

    if (!model || !model[modelName]) {
      return this.error('no such resource！');
    }

    const doc = model[modelName];

    try {
      const arr = await doc.find().select(filter).skip(offset)
        .limit(size);
      const count = await doc.count();
      this.success(this.makeList(arr, count));
    } catch (err) {
      this.error(err);
    }
  }

  async getId(type) {

    try {
      const ids = await this.ctx.model.Ids.findOne({
        name: type,
      });
      if (!ids) {
        let new_ids = new this.ctx.model.Ids({
          name: type,
        });
        new_ids = await new_ids.save();
        return new_ids.nowId;
      }
      ids.nowId++;
      ids.update_time = Date.now();
      await ids.save();
      return ids.nowId;

    } catch (err) {
      throw new Error(err);
    }
  }

  async getUser() {
    const token = this.ctx.cookies.get('token');

    if (!token) {
      return null;
    }
    const id = await this.app.redis.get(token);

    console.log('id', id);
    if (!id) {
      return null;
    }

    const user = await this.ctx.model.User.findOne({
      id,
    }).select('-password');

    console.log('user', user);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      user_name: user.user_name,
    };
  }

  success(data, retcode = 200) {

    if (!data) {
      return this.error('The data you requested does not exist.');
    }

    this.ctx.body = {
      retcode,
      status: 'success',
      data,
    };
  }

  error(msg, retcode = 40001) {

    this.ctx.body = {
      retcode,
      status: 'error',
      msg: msg || 'Unknown error.',
    };
  }

  unauthorized(msg, retcode = 40000) {

    this.ctx.body = {
      retcode,
      status: 'unauthorized',
      msg: msg || 'Please login before your further operation.',
    };
  }

  makeList(arr, count) {

    return {
      list: arr,
      total: count,
    };
  }

  encryption(password) {
    if (password.length < 4) {
      return this.Md5(password);
    }
    const newpassword = this.Md5(this.Md5(password).substr(2, 4) + this.Md5(password));
    return newpassword;
  }

  Md5(password) {
    const md5 = crypto.createHash('md5');
    return md5.update(password).digest('base64');
  }
}
module.exports = ApiController;
