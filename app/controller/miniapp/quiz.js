'use strict';

const Controller = require('../../core/api_controller');
class QuizController extends Controller {

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

      if (!model || !model['Quiz']) {
        return this.error('没有对应的数据模型。');
      }

      const doc = model['Quiz'];

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
      const quiz = await this.ctx.model.Quiz.findOne({
        id: this.ctx.params.id,
      });
      if (quiz.status !== 'audited') {
        return this.error('没有查看权限');
      }
      this.success(quiz);
    } catch (err) {
      this.logger.error(err);
      this.error('获取全卷失败！');
    }
  }

  async correct() {
    if (!this.ctx.params.id) {
      return this.error('缺少参数');
    }
    const {
      body,
    } = this.ctx.request;

    const { sheet } = body;
    console.log('body', this.ctx.body)
    console.log('sheet', sheet)
    try {
      const quiz = await this.ctx.model.Quiz.findOne({
        id: this.ctx.params.id,
      });
      if (quiz.status !== 'audited') {
        return this.error('非法试卷');
      }
      const { subjects } = quiz;
      let totalScore = 0;
      subjects.forEach(subject => {
        if (!sheet[subject.id]) return;
        const origionA = subject.answer.join(',');
        const sheetA = sheet[subject.id].join(',');
        if (origionA === sheetA) {
          totalScore += subject.score;
        }
      });
      this.success({
        quiz,
        score: totalScore,
      });
    } catch (err) {
      this.logger.error(err);
      this.error('提交试卷失败！');
    }
  }

}
module.exports = QuizController;