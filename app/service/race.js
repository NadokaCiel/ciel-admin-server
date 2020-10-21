const Service = require('egg').Service;

class RaceService extends Service {
  async find(id) {
    const race = await this.ctx.model.Race.findOne({
      id,
    });
    return race;
  }
}

module.exports = RaceService;