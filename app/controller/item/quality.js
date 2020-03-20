'use strict';

const createRule = {
  name: {
    type: 'string',
    required: true,
  },
  quality: {
    type: 'string',
    required: true,
  },
  color: {
    type: 'string',
    required: true,
  },
  mark: {
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
  quality: {
    type: 'string',
    required: true,
  },
  color: {
    type: 'string',
    required: true,
  },
  mark: {
    type: 'string',
    required: false,
  },
};

const Controller = require('../../core/api_controller');
class QualityController extends Controller {

  async index() {
    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 3) {
      return this.error('仅限管理员使用该功能');
    } else {
      await this.repackList('Quality');
    }
  }

  async create() {
    try {
      this.ctx.validate(createRule);

      const actor = await this.getUser(true);
      if (this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.Quality.find({
        name: this.ctx.request.body.name,
      });
      if (repeat.length > 0) {
        return this.error('品质名称已被使用');
      }

      let quality = new this.ctx.model.Quality(this.ctx.request.body);
      quality.id = await this.getId('quality_id');
      quality.creator = await this.getUser();
      quality = await quality.save();

      this.success({
        id: quality.id,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('Create Quality Failed');
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
      const quality = await this.ctx.model.Quality.findOne({
        id: this.ctx.params.id,
      });
      this.success(quality);
    } catch (err) {
      this.logger.error(err);
      this.error('获取品质失败！');
    }
  }

  async update() {
    try {
      this.ctx.validate(updateRule);

      const data = this.ctx.request.body;

      const actor = await this.getUser(true);

      const old = await this.ctx.model.Quality.findOne({
        id: data.id,
      });

      if (actor.id !== old.creator.id && this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.Quality.find({
        id: {
          $ne: data.id,
        },
        name: this.ctx.request.body.name,
      });
      if (repeat.length > 0) {
        return this.error('品质标题已被使用');
      }

      data.updater = await this.getUser();
      data.update_time = Date.now();

      const quality = await this.ctx.model.Quality.findOneAndUpdate({
        id: data.id,
      }, data, {
        new: true,
      });
      this.success(quality);
    } catch (err) {
      this.logger.error(err);
      return this.error('更新品质失败');
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
      await this.ctx.model.Quality.remove({
        id: this.ctx.params.id,
      });
      this.success('品质删除成功');
    } catch (err) {
      this.logger.error(err);
      this.error('品质删除失败！');
    }
  }

}
module.exports = QualityController;