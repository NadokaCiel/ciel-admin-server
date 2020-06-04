const Service = require('egg').Service;

class WxuserService extends Service {
  async find(openid) {
    const wxuser = await this.ctx.model.Wxuser.findOne({
      openid,
    });
    return wxuser;
  }

  async save(params) {
    const wxuser = await this.find(params.openid);
    if (wxuser) return false;
    const new_wxuser = new this.ctx.model.Wxuser(params);
    new_wxuser.id = await this.service.ids.getId('wxuser_id');
    await new_wxuser.save();
    return new_wxuser;
  }
}

module.exports = WxuserService;