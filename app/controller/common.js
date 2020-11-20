'use strict';

const Controller = require('../core/api_controller');
class CommonController extends Controller {

  async index() {
    const {
      model,
    } = this.ctx;
    const userDoc = model['User'];
    const articleDoc = model['Article'];
    const quizDoc = model['Quiz'];
    try {
      const userCount = await userDoc.count();
      const articleCount = await articleDoc.count();
      const quizCount = await quizDoc.count();
      this.success({
        userCount,
        articleCount,
        quizCount,
      });
    } catch (err) {
      this.logger.error(err);
      this.error(err);
    }
  }

  async signin() {
    try {
      const user = await this.getUser(true);
      if (user.signed) {
        return this.error('今日已签到', 45000);
      }
      const result = await this.service.signin.doSignin(user.id);
      this.success(result);
    } catch (err) {
      this.logger.error(err);
      this.error('签到失败！');
    }
  }
}
module.exports = CommonController;
