const Service = require('egg').Service;

// 一般通过用户id进行查找
class ResourceService extends Service {

  async create(params = {}) {
    if (!params.userid) {
      const user = await this.service.user.find();
      params.userid = user.id;
    }

    const new_resource = new this.ctx.model.Resource(params);
    new_resource.id = await this.service.ids.getId('resource_id');
    await new_resource.save();
    return new_resource;
  }

  async find(userid) {
    let resource = await this.ctx.model.Resource.findOne({
      userid,
    });
    if (!resource) {
      resource = await this.create();
    }
    return resource;
  }

  async save(params) {
    if (params.userid) {
      const updated_resource = await this.ctx.model.Resource.findOneAndUpdate({
        userid: params.userid,
      }, params, {
        new: true,
      });

      return updated_resource;
    } else {
      const new_resource = await this.create();
      return new_resource;
    }
  }
}

module.exports = ResourceService;