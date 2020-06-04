const Service = require('egg').Service;

class IdsService extends Service {
  async getId(type) {
    try {
      const ids = await this.ctx.model.Ids.findOne({
        name: type,
      });
      if (!ids) {
        let new_ids = new this.ctx.model.Ids({
          name: type,
        });
        new_ids = await new_ids.save();
        return new_ids.nowId;
      }
      ids.nowId++;
      ids.update_time = Date.now();
      await ids.save();
      return ids.nowId;
    } catch (err) {
      this.logger.error(err);
      throw new Error(err);
    }
  }
}

module.exports = IdsService;