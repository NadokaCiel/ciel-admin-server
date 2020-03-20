'use strict';

const createRule = {
  name: {
    type: 'string',
    required: true,
  },
  mark: {
    type: 'string',
    required: false,
  },
  race: {
    type: 'string',
    required: true,
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
  race: {
    type: 'string',
    required: true,
  },
  name: {
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
class RaceController extends Controller {

  async index() {
    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 3) {
      return this.error('仅限管理员使用该功能');
    } else {
      await this.repackList('Race');
    }
  }

  async create() {
    try {
      this.ctx.validate(createRule);

      const actor = await this.getUser(true);
      if (this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.Race.find({
        name: this.ctx.request.body.name,
      });
      if (repeat.length > 0) {
        return this.error('种族名称已被使用');
      }

      let race = new this.ctx.model.Race(this.ctx.request.body);
      race.id = await this.getId('race_id');
      race.creator = await this.getUser();
      race = await race.save();

      this.success({
        id: race.id,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('Create Race Failed');
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
      const race = await this.ctx.model.Race.findOne({
        id: this.ctx.params.id,
      });
      this.success(race);
    } catch (err) {
      this.logger.error(err);
      this.error('获取种族失败！');
    }
  }

  async update() {
    try {
      this.ctx.validate(updateRule);

      const data = this.ctx.request.body;

      const actor = await this.getUser(true);

      const old = await this.ctx.model.Race.findOne({
        id: data.id,
      });

      if (actor.id !== old.creator.id && this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.Race.find({
        id: {
          $ne: data.id,
        },
        name: this.ctx.request.body.name,
      });
      if (repeat.length > 0) {
        return this.error('种族标题已被使用');
      }

      data.updater = await this.getUser();
      data.update_time = Date.now();

      const race = await this.ctx.model.Race.findOneAndUpdate({
        id: data.id,
      }, data, {
        new: true,
      });
      this.success(race);
    } catch (err) {
      this.logger.error(err);
      return this.error('更新种族失败');
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
      await this.ctx.model.Race.remove({
        id: this.ctx.params.id,
      });
      this.success('种族删除成功');
    } catch (err) {
      this.logger.error(err);
      this.error('种族删除失败！');
    }
  }

  async option() {
    try {
      const {
        query,
        model,
      } = this.ctx;

      const filter = '-_id -__v -create_time -update_time -creator -updater';

      const raceDoc = model.Race;
      const raceArr = await raceDoc.find().select(filter);

      this.success({
        list: raceArr,
      });
    } catch (err) {
      this.logger.error(err);
      this.error(err);
    }
  }
}
module.exports = RaceController;