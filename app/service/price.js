const Service = require('egg').Service;

class PriceService extends Service {

  async create(params = {}) {
    const new_price = new this.ctx.model.Price(params);
    new_price.id = await this.service.ids.getId('price_id');
    await new_price.save();
    return new_price;
  }

  async find(id) {
    let price = await this.ctx.model.Price.findOne({
      id,
    });
    return price;
  }

  async save(params) {
    if (params.id) {
      const updated_price = await this.ctx.model.Price.findOneAndUpdate({
        id: params.id,
      }, params, {
        new: true,
      });

      return updated_price;
    } else {
      const new_price = await this.create();
      return new_price;
    }
  }
}

module.exports = PriceService;