'use strict';

const createRule = {
  name: {
    type: 'string',
    required: true,
  },
  type: {
    type: 'string',
    required: true,
  },
  mark: {
    type: 'string',
    required: false,
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
  type: {
    type: 'string',
    required: true,
  },
  mark: {
    type: 'string',
    required: false,
  },
  image: {
    type: 'string',
    required: false,
  },
};

const Controller = require('../../core/api_controller');
class ItemTypeController extends Controller {

  async index() {
    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 3) {
      return this.error('仅限管理员使用该功能');
    } else {
      await this.repackList('ItemType');
    }
  }

  async create() {
    try {
      this.ctx.validate(createRule);

      const actor = await this.getUser(true);
      if (this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.ItemType.find({
        name: this.ctx.request.body.name,
      });
      if (repeat.length > 0) {
        return this.error('物品类型名称已被使用');
      }

      let itemType = new this.ctx.model.ItemType(this.ctx.request.body);
      itemType.id = await this.getId('itemType_id');
      itemType.creator = await this.getUser();
      itemType = await itemType.save();

      this.success({
        id: itemType.id,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('Create ItemType Failed');
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
      const itemType = await this.ctx.model.ItemType.findOne({
        id: this.ctx.params.id,
      });
      this.success(itemType);
    } catch (err) {
      this.logger.error(err);
      this.error('获取物品类型失败！');
    }
  }

  async update() {
    try {
      this.ctx.validate(updateRule);

      const data = this.ctx.request.body;

      const actor = await this.getUser(true);

      const old = await this.ctx.model.ItemType.findOne({
        id: data.id,
      });

      if (actor.id !== old.creator.id && this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.ItemType.find({
        id: {
          $ne: data.id,
        },
        name: this.ctx.request.body.name,
      });
      if (repeat.length > 0) {
        return this.error('物品类型标题已被使用');
      }

      data.updater = await this.getUser();
      data.update_time = Date.now();

      const itemType = await this.ctx.model.ItemType.findOneAndUpdate({
        id: data.id,
      }, data, {
        new: true,
      });
      this.success(itemType);
    } catch (err) {
      this.logger.error(err);
      return this.error('更新物品类型失败');
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
      await this.ctx.model.ItemType.remove({
        id: this.ctx.params.id,
      });
      this.success('物品类型删除成功');
    } catch (err) {
      this.logger.error(err);
      this.error('物品类型删除失败！');
    }
  }

}
module.exports = ItemTypeController;