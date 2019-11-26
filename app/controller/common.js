'use strict';

const Controller = require('../core/api_controller');
class CommonController extends Controller {

  async index() {
    const {
      model,
    } = this.ctx;
    const userDoc = model['User'];
    const articleDoc = model['Article'];
    try {
      const userCount = await userDoc.count();
      const articleCount = await articleDoc.count();
      this.success({
        userCount,
        articleCount,
      });
    } catch (err) {
      this.error(err);
    }
  }
}
module.exports = CommonController;
