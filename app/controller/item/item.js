'use strict';

const createRule = {
  name: {
    type: 'string',
    required: true,
  },
  type_id: {
    type: 'number',
    required: true,
  },
  quality_id: {
    type: 'number',
    required: true,
  },
  stack: {
    type: 'number',
    required: true,
  },
  price: {
    type: 'number',
    required: false,
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
  type_id: {
    type: 'number',
    required: true,
  },
  quality_id: {
    type: 'number',
    required: true,
  },
  stack: {
    type: 'number',
    required: true,
  },
  price: {
    type: 'number',
    required: false,
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
class ItemController extends Controller {

  async index() {
    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 3) {
      return this.error('仅限管理员使用该功能');
    } else {
      await this.repackList('Item');
    }
  }

  async create() {
    try {
      this.ctx.validate(createRule);

      const actor = await this.getUser(true);
      if (this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.Item.find({
        name: this.ctx.request.body.name,
      });
      if (repeat.length > 0) {
        return this.error('物品名称已被使用');
      }

      let item = new this.ctx.model.Item(this.ctx.request.body);
      item.id = await this.getId('item_id');
      item.creator = await this.getUser();
      item = await item.save();

      this.success({
        id: item.id,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('Create Item Failed');
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
      const item = await this.ctx.model.Item.findOne({
        id: this.ctx.params.id,
      });
      this.success(item);
    } catch (err) {
      this.logger.error(err);
      this.error('获取物品失败！');
    }
  }

  async update() {
    try {
      this.ctx.validate(updateRule);

      const data = this.ctx.request.body;

      const actor = await this.getUser(true);

      const old = await this.ctx.model.Item.findOne({
        id: data.id,
      });

      if (actor.id !== old.creator.id && this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.Item.find({
        id: {
          $ne: data.id,
        },
        name: this.ctx.request.body.name,
      });
      if (repeat.length > 0) {
        return this.error('物品标题已被使用');
      }

      data.updater = await this.getUser();
      data.update_time = Date.now();

      const item = await this.ctx.model.Item.findOneAndUpdate({
        id: data.id,
      }, data, {
        new: true,
      });
      this.success(item);
    } catch (err) {
      this.logger.error(err);
      return this.error('更新物品失败');
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
      await this.ctx.model.Item.remove({
        id: this.ctx.params.id,
      });
      this.success('物品删除成功');
    } catch (err) {
      this.logger.error(err);
      this.error('物品删除失败！');
    }
  }

  async option() {
    try {
      const {
        query,
        model,
      } = this.ctx;

      const filter = '-_id -__v -create_time -update_time -creator -updater';

      const typeDoc = model.ItemType;
      const typeArr = await typeDoc.find().select(filter);

      const qualityDoc = model.Quality;
      const qualityArr = await qualityDoc.find().select(filter);

      this.success({
        type: typeArr,
        quality: qualityArr,
      });
    } catch (err) {
      this.logger.error(err);
      this.error(err);
    }
  }
}
module.exports = ItemController;