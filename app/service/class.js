const Service = require('egg').Service;

class ClassService extends Service {
  async find(id) {
    const rank = await this.ctx.model.Class.findOne({
      id,
    });
    return rank;
  }
}

module.exports = ClassService;