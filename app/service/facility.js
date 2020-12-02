const Service = require('egg').Service;

// 一般通过用户id进行查找
class FacilityService extends Service {

  async create(params = {}) {
    if (!params.userid) {
      const user = await this.service.user.find();
      params.userid = user.id;
    }

    const new_facility = new this.ctx.model.Facility(params);
    new_facility.id = await this.service.ids.getId('facility_id');
    await new_facility.save();
    return new_facility;
  }

  async find(userid) {
    let facility = await this.ctx.model.Facility.findOne({
      userid,
    });
    if (!facility) {
      facility = await this.create();
    }
    return facility;
  }

  async save(params) {
    if (params.userid) {
      const updated_facility = await this.ctx.model.Facility.findOneAndUpdate({
        userid: params.userid,
      }, params, {
        new: true,
      });

      return updated_facility;
    } else {
      const new_facility = await this.create();
      return new_facility;
    }
  }
}

module.exports = FacilityService;