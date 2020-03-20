'use strict';

const createRule = {
  name: {
    type: 'string',
    required: true,
  },
  class: {
    type: 'string',
    required: true,
  },
  mark: {
    type: 'string',
    required: false,
  },
  str_base: {
    type: 'number',
    required: true,
  },
  int_base: {
    type: 'number',
    required: true,
  },
  agi_base: {
    type: 'number',
    required: true,
  },
  fit_base: {
    type: 'number',
    required: true,
  },
  mtl_base: {
    type: 'number',
    required: true,
  },
  atk_rate: {
    type: 'number',
    required: true,
  },
  mag_rate: {
    type: 'number',
    required: true,
  },
  spd_rate: {
    type: 'number',
    required: true,
  },
  def_rate: {
    type: 'number',
    required: true,
  },
  mdf_rate: {
    type: 'number',
    required: true,
  },
  hp_rate: {
    type: 'number',
    required: true,
  },
  mp_rate: {
    type: 'number',
    required: true,
  },
  image: {
    type: 'string',
    required: false,
  },
};

const updateRule = {
  id: {
    type: 'number',
    required: true,
  },
  name: {
    type: 'string',
    required: true,
  },
  class: {
    type: 'string',
    required: true,
  },
  mark: {
    type: 'string',
    required: false,
  },
  str_base: {
    type: 'number',
    required: true,
  },
  int_base: {
    type: 'number',
    required: true,
  },
  agi_base: {
    type: 'number',
    required: true,
  },
  fit_base: {
    type: 'number',
    required: true,
  },
  mtl_base: {
    type: 'number',
    required: true,
  },
  atk_rate: {
    type: 'number',
    required: true,
  },
  mag_rate: {
    type: 'number',
    required: true,
  },
  spd_rate: {
    type: 'number',
    required: true,
  },
  def_rate: {
    type: 'number',
    required: true,
  },
  mdf_rate: {
    type: 'number',
    required: true,
  },
  hp_rate: {
    type: 'number',
    required: true,
  },
  mp_rate: {
    type: 'number',
    required: true,
  },
  image: {
    type: 'string',
    required: false,
  },
};

const Controller = require('../../core/api_controller');
class ClassController extends Controller {

  async index() {
    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 3) {
      return this.error('仅限管理员使用该功能');
    } else {
      await this.repackList('Class');
    }
  }

  async create() {
    try {
      this.ctx.validate(createRule);

      const actor = await this.getUser(true);
      if (this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.Class.find({
        name: this.ctx.request.body.name,
      });
      if (repeat.length > 0) {
        return this.error('职业名称已被使用');
      }

      let classItem = new this.ctx.model.Class(this.ctx.request.body);
      classItem.id = await this.getId('class_id');
      classItem.creator = await this.getUser();
      classItem = await classItem.save();

      this.success({
        id: classItem.id,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('Create Class Failed');
    }
  }

  async show() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数');
    }
    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 3) {
      return this.error('没有操作权限');
    }
    try {
      const classItem = await this.ctx.model.Class.findOne({
        id: this.ctx.params.id,
      });
      this.success(classItem);
    } catch (err) {
      this.logger.error(err);
      this.error('获取职业失败！');
    }
  }

  async update() {
    try {
      this.ctx.validate(updateRule);

      const data = this.ctx.request.body;

      const actor = await this.getUser(true);

      const old = await this.ctx.model.Class.findOne({
        id: data.id,
      });

      if (actor.id !== old.creator.id && this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.Class.find({
        id: {
          $ne: data.id,
        },
        name: this.ctx.request.body.name,
      });
      if (repeat.length > 0) {
        return this.error('职业标题已被使用');
      }

      data.updater = await this.getUser();
      data.update_time = Date.now();

      const classItem = await this.ctx.model.Class.findOneAndUpdate({
        id: data.id,
      }, data, {
        new: true,
      });
      this.success(classItem);
    } catch (err) {
      this.logger.error(err);
      return this.error('更新职业失败');
    }
  }

  async destroy() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数');
    }

    const actor = await this.getUser(true);

    if (this.roleRank(actor.role) < 4) {
      return this.error('无权进行该操作');
    }

    try {
      await this.ctx.model.Class.remove({
        id: this.ctx.params.id,
      });
      this.success('职业删除成功');
    } catch (err) {
      this.logger.error(err);
      this.error('职业删除失败！');
    }
  }

  async option() {
    try {
      const {
        query,
        model,
      } = this.ctx;

      const filter = '-_id -__v -create_time -update_time -creator -updater';

      const classDoc = model.Class;
      const classArr = await classDoc.find().select(filter);

      this.success({
        list: classArr,
      });
    } catch (err) {
      this.logger.error(err);
      this.error(err);
    }
  }
}
module.exports = ClassController;