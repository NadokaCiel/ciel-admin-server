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
  icon: {
    type: 'string',
    required: true,
  },
  desc: {
    type: 'string',
    required: false,
  },
  basePrice: {
    type: 'number',
    required: true,
  },
  baseFond: {
    type: 'number',
    required: true,
  },
  fondRate: {
    type: 'number',
    required: true,
  },
  cleanRate: {
    type: 'number',
    required: true,
  },
  feedRate: {
    type: 'number',
    required: true,
  },
  playLimit: {
    type: 'number',
    required: true,
  },
  talkLimit: {
    type: 'number',
    required: true,
  },
  visitLimit: {
    type: 'number',
    required: true,
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
  icon: {
    type: 'string',
    required: true,
  },
  desc: {
    type: 'string',
    required: false,
  },
  basePrice: {
    type: 'number',
    required: true,
  },
  baseFond: {
    type: 'number',
    required: true,
  },
  fondRate: {
    type: 'number',
    required: true,
  },
  cleanRate: {
    type: 'number',
    required: true,
  },
  feedRate: {
    type: 'number',
    required: true,
  },
  playLimit: {
    type: 'number',
    required: true,
  },
  talkLimit: {
    type: 'number',
    required: true,
  },
  visitLimit: {
    type: 'number',
    required: true,
  },
};

const Controller = require('../core/api_controller');
class PetTypeController extends Controller {

  async index() {
    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 4) {
      await this.repackList('PetType', null, null, {
        status: 'available',
      });
    } else {
      await this.repackList('PetType');
    }
  }

  async create() {
    try {
      this.ctx.validate(createRule);

      const repeat = await this.ctx.model.PetType.find({
        $or: [ //多条件，数组
          {
            name: this.ctx.request.body.name,
          }, {
            type: this.ctx.request.body.type,
          }
        ]
      });
      if (repeat.length > 0) {
        return this.error('宠物名称或类型已被使用');
      }

      const actor = await this.getUser(true);
      if (this.roleRank(actor.role) < 4) {
        return this.error('没有操作权限');
      }

      let petType = new this.ctx.model.PetType(this.ctx.request.body);
      petType.id = await this.getId('petType_id');
      petType.creator = await this.getUser();
      // petType.status = 'frozen';
      petType = await petType.save();

      this.success({
        id: petType.id,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('Create PetType Failed');
    }
  }

  async show() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数');
    }
    try {
      const petType = await this.ctx.model.PetType.findOne({
        id: this.ctx.params.id,
      });
      this.success(petType);
    } catch (err) {
      this.logger.error(err);
      this.error('获取宠物类型失败！');
    }
  }

  async update() {
    try {
      this.ctx.validate(updateRule);

      const data = this.ctx.request.body;

      const actor = await this.getUser(true);

      const old = await this.ctx.model.PetType.findOne({
        id: data.id,
      });

      if (actor.id !== old.creator.id && this.roleRank(actor.role) < 4) {
        return this.error('没有操作权限');
      }

      data.status = 'frozen';

      const repeat = await this.ctx.model.PetType.find({
        id: {
          $ne: data.id,
        },
        $or: [ //多条件，数组
          {
            name: this.ctx.request.body.name,
          }, {
            type: this.ctx.request.body.type,
          }
        ]
      });
      if (repeat.length > 0) {
        return this.error('宠物名称或类型已被使用');
      }

      data.updater = await this.getUser();

      data.update_time = Date.now();

      const petType = await this.ctx.model.PetType.findOneAndUpdate({
        id: data.id,
      }, data, {
        new: true,
      });
      this.success(petType);
    } catch (err) {
      this.logger.error(err);
      return this.error('更新宠物类型失败');
    }
  }

  async freeze() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数');
    }

    const actor = await this.getUser(true);

    if (this.roleRank(actor.role) < 4) {
      return this.error('无权进行该操作');
    }

    try {
      const petType = await this.ctx.model.PetType.findOne({
        id: this.ctx.params.id,
      });

      if (petType.status === 'frozen') {
        return this.error('该类型已被冻结！');
      }

      await this.ctx.model.PetType.findOneAndUpdate({
        id: petType.id,
      }, {
        status: 'frozen',
      }, {
        new: true,
      });
      this.success({
        id: petType.id,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('宠物类型冻结失败！');
    }
  }

  async unfreeze() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数');
    }

    const actor = await this.getUser(true);

    if (this.roleRank(actor.role) < 4) {
      return this.error('无权进行该操作');
    }

    try {
      const petType = await this.ctx.model.PetType.findOne({
        id: this.ctx.params.id,
      });

      if (petType.status === 'available') {
        return this.error('该类型已被解冻！');
      }

      await this.ctx.model.PetType.findOneAndUpdate({
        id: petType.id,
      }, {
        status: 'available',
      }, {
        new: true,
      });
      this.success({
        id: petType.id,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('宠物类型解冻失败！');
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
      await this.ctx.model.PetType.remove({
        id: this.ctx.params.id,
      });
      this.success('宠物类型删除成功');
    } catch (err) {
      this.logger.error(err);
      this.error('宠物类型删除失败！');
    }
  }

}
module.exports = PetTypeController;
