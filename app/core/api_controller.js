'use strict';

const { Controller } = require('egg');
const crypto = require('crypto');

const roleRank = {
  visitor: 1,
  user: 2,
  admin: 3,
  superadmin: 4,
};

class ApiController extends Controller {
  async repackList(modelName, select, getAll, params = {}) {

    try {
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
        return this.error('没有对应的数据模型。');
      }

      const doc = model[modelName];

      const arr = await doc.find(params).sort('field -update_time -create_time').select(filter).skip(offset)
        .limit(size);
      const count = await doc.count();
      this.success(this.makeList(arr, count));
    } catch (err) {
      this.logger.error(err);
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
        if (type === 'user_id' && new_ids.nowId === 1) {
          new_ids.nowId++;
        }
        new_ids = await new_ids.save();
        return new_ids.nowId;
      }
      ids.nowId++;
      ids.update_time = Date.now();
      await ids.save();
      return ids.nowId;

    } catch (err) {
      this.logger.error(err);
      throw new Error(err);
    }
  }

  async getUser(showAll = false, userId) {
    // const token = this.ctx.cookies.get('token');
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

    if (showAll) {
      return user;
    }
    return {
      id: user.id,
      user_name: user.user_name,
    };

  }

  success(data, retcode = 200) {

    if (!data) {
      return this.error('数据不存在。');
    }

    this.ctx.body = {
      retcode,
      status: 'success',
      data,
    };
  }

  error(msg, retcode = 40001, data = {}) {

    this.ctx.body = {
      retcode,
      data,
      status: 'error',
      msg: msg || '未知错误。',
    };

    this.logger.error(this.ctx);
  }

  unauthorized(msg, retcode = 40000) {

    this.ctx.body = {
      retcode,
      status: 'unauthorized',
      msg: msg || '请先登录，再进行其他操作。',
    };
  }

  makeList(arr, count) {

    return {
      list: arr,
      total: count,
    };
  }

  roleRank(role) {
    return roleRank[role] || 0;
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
