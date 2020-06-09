'use strict';

const createRule = {
  title: {
    type: 'string',
    required: true,
  },
  author: {
    type: 'string',
    required: true,
  },
  cover: {
    type: 'string',
    required: true,
  },
  subjects: {
    type: 'array',
    required: true,
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
    required: true,
  },
  cover: {
    type: 'string',
    required: true,
  },
  subjects: {
    type: 'array',
    required: true,
  },
};

const statusMap = {
  pending: '待审核',
  audited: '审核通过',
  failed: '审核失败',
};

const WEAPP_QUIZ_PATH = 'pages/quiz/index/quiz';

const Controller = require('../../core/api_controller');
class QuizController extends Controller {

  async index() {
    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 3) {
      return this.error('仅限管理员使用该功能');
    } else {
      await this.repackList('Quiz');
    }
  }

  async create() {
    try {
      this.ctx.validate(createRule);

      const actor = await this.getUser(true);
      if (this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      const repeat = await this.ctx.model.Quiz.find({
        title: this.ctx.request.body.title,
      });
      if (repeat.length > 0) {
        return this.error('该问卷标题已被使用');
      }

      let quiz = new this.ctx.model.Quiz(this.ctx.request.body);
      let score = 0;
      quiz.subjects.forEach((subject, index) => {
        const line = subject;
        line.idx = index + 1;
        score += subject.score || 0;
      });
      if (score !== 100) {
        return this.error('问卷总分值错误');
      }
      quiz.id = await this.getId('quiz_id');
      quiz.creator = await this.getUser();
      quiz.status = 'pending';
      quiz = await quiz.save();

      this.success({
        id: quiz.id,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('Create Quiz Failed');
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
      const quiz = await this.ctx.model.Quiz.findOne({
        id: this.ctx.params.id,
      });
      this.success(quiz);
    } catch (err) {
      this.logger.error(err);
      this.error('获取问卷失败！');
    }
  }

  async update() {
    try {
      this.ctx.validate(updateRule);

      const data = this.ctx.request.body;

      let score = 0;
      data.subjects.forEach((subject, index) => {
        const line = subject;
        line.idx = index + 1;
        score += subject.score || 0;
      });
      if (score !== 100) {
        return this.error('问卷总分值错误');
      }

      const actor = await this.getUser(true);

      const old = await this.ctx.model.Quiz.findOne({
        id: data.id,
      });

      if (actor.id !== old.creator.id && this.roleRank(actor.role) < 3) {
        return this.error('没有操作权限');
      }

      if (data.status === 'audited' && this.roleRank(actor.role) < 3) {
        return this.error('已审核通过的问卷无法修改');
      }

      data.status = 'pending';

      const repeat = await this.ctx.model.Quiz.find({
        id: {
          $ne: data.id,
        },
        title: this.ctx.request.body.title,
      });
      if (repeat.length > 0) {
        return this.error('该问卷标题已被使用');
      }

      data.updater = await this.getUser();
      data.update_time = Date.now();

      const quiz = await this.ctx.model.Quiz.findOneAndUpdate({
        id: data.id,
      }, data, {
        new: true,
      });
      this.success(quiz);
    } catch (err) {
      this.logger.error(err);
      return this.error('更新问卷失败');
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
      await this.ctx.model.Quiz.remove({
        id: this.ctx.params.id,
      });
      this.success('问卷删除成功');
    } catch (err) {
      this.logger.error(err);
      this.error('问卷删除失败！');
    }
  }

  async status() {
    try {

      const data = this.ctx.request.body;

      if (!statusMap[data.status]) {
        return this.error('错误的状态操作');
      }

      const actor = await this.getUser(true);

      const old = await this.ctx.model.Quiz.findOne({
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

      const quiz = await this.ctx.model.Quiz.findOneAndUpdate({
        id: old.id,
      }, old, {
        new: true,
      });
      this.success({
        id: old.id,
      });
    } catch (err) {
      this.logger.error(err);
      return this.error('操作问卷失败');
    }
  }

  async qrcode() {
    const { id } = this.ctx.params;
    if (!id) {
      return this.error('缺少参数');
    }

    const actor = await this.getUser(true);

    if (this.roleRank(actor.role) < 3) {
      return this.error('无权进行该操作');
    }

    try {
      const result = await this.service.weapp.qrcode({
        scene: id,
        page: WEAPP_QUIZ_PATH,
      });
      if (result.url) {
        const quiz = await this.ctx.model.Quiz.findOne({
          id,
        });

        quiz.qrcode_url = result.url;

        quiz.updater = await this.getUser();
        quiz.update_time = Date.now();

        await this.ctx.model.Quiz.findOneAndUpdate({
          id: quiz.id,
        }, quiz, {
          new: true,
        });

        this.success(result);
      } else {
        this.error(result);
      }
    } catch (err) {
      // console.log("---------------------------- qrcode made err ----------------------------");
      // console.log(err);
      this.logger.error(err);
      this.error('获取二维码失败！');
    }
  }

  async result() {
    const { id } = this.ctx.params;
    if (!id) {
      return this.error('缺少参数');
    }

    const actor = await this.getUser(true);
    if (this.roleRank(actor.role) < 3) {
      return this.error('仅限管理员使用该功能');
    } else {
      await this.repackList('Transcript', null, null, {
        quiz_id: id,
      });
    }
  }
}
module.exports = QuizController;