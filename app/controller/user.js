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

const updateRule = {
  id: {
    type: 'number',
    required: true,
  },
  user_name: {
    type: 'string',
    required: true,
  },
  role: {
    type: 'string',
    required: true,
  },
};

const roleRank = {
  visitor: 1,
  user: 2,
  admin: 3,
  superadmin: 4,
}

const Controller = require('../core/api_controller');
class UserController extends Controller {

  async index() {
    await this.repackList('User', '-password');
  }

  async createAccount() {
    try {
      this.ctx.validate(createRule);

      const repeat = await this.ctx.model.User.find({
        user_name: this.ctx.request.body.user_name,
      }).select('-password');
      if (repeat.length > 0) {
        return this.error('用户名已被使用');
      }

      const new_user = new this.ctx.model.User(this.ctx.request.body);
      new_user.id = await this.getId('user_id');
      new_user.password = this.encryption(new_user.password);

      const actor = await this.getUser(true);

      console.log('new_user', new_user);
      console.log('actor', actor);
      if (roleRank[actor.role] < 3) {
        return this.error('没有创建用户的权限');
      }

      if (roleRank[actor.role] === 3 && roleRank[new_user.role] >= 3) {
        return this.error('无法创建拥有该权限的用户');
      }

      const user = await new_user.save();

      this.success({
        id: user.id,
        name: new_user.user_name,
      });
      // this.ctx.status = 201
    } catch (err) {
      console.log(err);
      this.error(err);
      // this.error("Create User Failed")
    }
  }

  async show() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数！');
    }
    try {
      const user = await this.ctx.model.User.findOne({
        id: this.ctx.params.id,
      }).select('-password');
      this.success(user);
      // this.ctx.status = 200
    } catch (err) {
      this.error('获取用户失败！');
    }
  }

  async update() {
    try {
      this.ctx.validate(updateRule);

      const data = this.ctx.request.body;

      const repeat = await this.ctx.model.User.find({
        id: {
          $ne: data.id,
        },
        user_name: this.ctx.request.body.user_name,
      }).select('-password');
      if (repeat.length > 0) {
        return this.error('用户名已被使用');
      }

      const accepter = await this.getUser(true, data.id);
      const actor = await this.getUser(true);

      if (roleRank[actor.role] < 2) {
        return this.error('没有操作权限');
      }

      if (roleRank[actor.role] < roleRank[accepter.role]) {
        return this.error('权限不足');
      }

      if (roleRank[accepter.role] !== roleRank[data.role] && actor.role !== 'superadmin') {
        return this.error('无法更改该用户的角色');
      }

      data.update_time = Date.now();

      const user = await this.ctx.model.User.findOneAndUpdate({
        id: data.id,
      }, data, {
        new: true,
      }).select('-password');
      this.success({
        id: user.id,
      });
      // this.ctx.status = 200
    } catch (err) {
      return this.error('用户更新失败');
    }
  }

  async destroy() {
    const id = this.ctx.params.id;
    if (!id) {
      return this.error('缺少参数！');
    }

    const user = await this.getUser(true, id);
    const actor = await this.getUser(true);

    if (roleRank[actor.role] < 3) {
      return this.error('无权进行该操作');
    }

    if ((user.role === 'superadmin' || user.role === 'admin') && actor.role !== 'superadmin') {
      return this.error('无权删除该用户');
    }

    if (user.id === actor.id) {
      return this.error('无法删除自己的账户');
    }

    try {
      const user = await this.ctx.model.User.remove({
        id,
      });
      this.success('删除用户成功');
      // this.ctx.status = 204
    } catch (err) {
      this.error('删除用户失败');
    }
  }

}
module.exports = UserController;
