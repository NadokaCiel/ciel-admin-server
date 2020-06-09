const Service = require('egg').Service;

class QuizService extends Service {
  async find(id) {
    const quiz = await this.ctx.model.Quiz.findOne({
      id,
    });
    return quiz;
  }
}

module.exports = QuizService;