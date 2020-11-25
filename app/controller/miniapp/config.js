'use strict';

const Controller = require('../../core/api_controller');
class ConfigController extends Controller {
  async show() {
    try {
      const config = await this.ctx.model.Config.findOne({
        id: 1,
      });
      this.success(config);
    } catch (err) {
      this.logger.error(err);
      this.error('获取配置失败！');
    }
  }
}
module.exports = ConfigController;