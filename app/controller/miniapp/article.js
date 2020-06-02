'use strict';

const Controller = require('../../core/api_controller');
class ArticleController extends Controller {

  async index() {
    try {
      const {
        model,
      } = this.ctx;

      const {
        body,
      } = this.ctx.request;

      const size = Number(body.size) || 10;
      const page = body.page || 1;
      const offset = Number((page - 1) * size);
      const filter = ' -_id -__v';
      const params = {
        status: 'audited',
      };

      if (!model || !model['Article']) {
        return this.error('没有对应的数据模型。');
      }

      const doc = model['Article'];

      const arr = await doc.find(params).select(filter).skip(offset)
        .limit(size);
      const count = await doc.find(params).select(filter).count();
      this.success(this.makeList(arr, count));
    } catch (err) {
      this.logger.error(err);
      this.error(err);
    }
  }

  async show() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数');
    }
    try {
      const article = await this.ctx.model.Article.findOne({
        id: this.ctx.params.id,
      });
      if (article.status !== 'audited') {
        return this.error('没有查看权限');
      }
      this.success(article);
    } catch (err) {
      this.logger.error(err);
      this.error('获取文章失败！');
    }
  }

}
module.exports = ArticleController;