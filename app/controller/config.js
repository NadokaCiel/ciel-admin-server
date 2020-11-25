'use strict';

const updateRule = {
  ai_option: {
    type: 'array',
    required: true,
  },
};

const Controller = require('../core/api_controller');
class ConfigController extends Controller {

  async info() {
    try {
      const config = await this.ctx.model.Config.find({
        id: 1,
      });
      this.success(config[0] || {});
    } catch (err) {
      this.logger.error(err);
      this.error('获取配置失败！');
    }
  }

  async update() {
    try {
      this.ctx.validate(updateRule);

      const data = this.ctx.request.body;

      const config = await this.ctx.model.Config.find({
        id: 1,
      });
      if (config.length > 0) {
        data.update_time = Date.now();
        await this.ctx.model.Config.findOneAndUpdate({
          id: 1,
        }, data, {
          new: true,
        });
      } else {
        const new_config = new this.ctx.model.Config(this.ctx.request.body);
        new_config.id = 1;
        await new_config.save();
      }

      this.success({
        id: 1,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('配置更新失败');
    }
  }

}
module.exports = ConfigController;
