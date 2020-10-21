'use strict';

const createRule = {
  title: {
    type: 'string',
    required: true,
  },
  author: {
    type: 'string',
    required: false,
  },
  content: {
    type: 'string',
    required: true,
  },
  abstruct: {
    type: 'string',
    required: false,
  },
  tag: {
    type: 'array',
    required: false,
  },
  cover: {
    type: 'string',
    required: false,
  },
};

const updateRule = {
  id: {
    type: 'number',
    required: true,
  },
  title: {
    type: 'string',
    required: true,
  },
  author: {
    type: 'string',
    required: false,
  },
  content: {
    type: 'string',
    required: true,
  },
  abstruct: {
    type: 'string',
    required: false,
  },
  tag: {
    type: 'array',
    required: false,
  },
  cover: {
    type: 'string',
    required: false,
  },
};

const statusMap = {
  pending: '待审核',
  audited: '审核通过',
  failed: '审核失败',
};

const Controller = require('../core/api_controller');
class ArticleController extends Controller {

  async index() {
    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 3) {
      await this.repackList('Article', null, null, {
        status: 'audited',
      });
    } else {
      await this.repackList('Article');
    }
  }

  async create() {
    try {
      this.ctx.validate(createRule);

      const repeat = await this.ctx.model.Article.find({
        title: this.ctx.request.body.title,
      });
      if (repeat.length > 0) {
        return this.error('文章标题已被使用');
      }

      const actor = await this.getUser(true);
      if (this.roleRank(actor.role) < 2) {
        return this.error('没有操作权限');
      }

      let article = new this.ctx.model.Article(this.ctx.request.body);
      article.id = await this.getId('article_id');
      article.creator = await this.getUser();
      article.status = 'pending';
      article = await article.save();

      this.success({
        id: article.id,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('创建文章失败！');
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
      this.success(article);
    } catch (err) {
      this.logger.error(err);
      this.error('获取文章失败！');
    }
  }

  async update() {
    try {
      this.ctx.validate(updateRule);

      const data = this.ctx.request.body;

      const actor = await this.getUser(true);

      const old = await this.ctx.model.Article.findOne({
        id: data.id,
      });

      if (actor.id !== old.creator.id && this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      if (data.status === 'audited' && this.roleRank(actor.role) < 3) {
        return this.error('已审核通过的文章无法修改');
      }

      data.status = 'pending';

      const repeat = await this.ctx.model.Article.find({
        id: {
          $ne: data.id,
        },
        title: this.ctx.request.body.title,
      });
      if (repeat.length > 0) {
        return this.error('文章标题已被使用');
      }

      data.updater = await this.getUser();

      data.update_time = Date.now();

      const article = await this.ctx.model.Article.findOneAndUpdate({
        id: data.id,
      }, data, {
        new: true,
      });
      this.success(article);
    } catch (err) {
      this.logger.error(err);
      return this.error('更新文章失败');
    }
  }

  async destroy() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数');
    }

    const actor = await this.getUser(true);

    if (this.roleRank(actor.role) < 3) {
      return this.error('无权进行该操作');
    }

    try {
      await this.ctx.model.Article.remove({
        id: this.ctx.params.id,
      });
      this.success('文章删除成功');
    } catch (err) {
      this.logger.error(err);
      this.error('文章删除失败！');
    }
  }

  async status() {
    try {

      const data = this.ctx.request.body;

      if (!statusMap[data.status]) {
        return this.error('错误的状态操作');
      }

      const actor = await this.getUser(true);

      const old = await this.ctx.model.Article.findOne({
        id: data.id,
      });

      if (data.status === 'audited' && this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      if (actor.id !== old.creator.id && this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      old.status = data.status;

      old.updater = await this.getUser();

      old.update_time = Date.now();

      const article = await this.ctx.model.Article.findOneAndUpdate({
        id: old.id,
      }, old, {
        new: true,
      });
      this.success({
        id: old.id,
      });
    } catch (err) {
      this.logger.error(err);
      return this.error('操作文章失败');
    }
  }

}
module.exports = ArticleController;
