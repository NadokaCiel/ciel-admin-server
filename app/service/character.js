const Service = require('egg').Service;

class CharacterService extends Service {
  async find(id) {
    const character = await this.ctx.model.Character.findOne({
      id,
    });
    return character;
  }

  async save(params) {
    if (params.id) {
      const updated_character = await this.ctx.model.Class.findOneAndUpdate({
        id: params.id,
      }, params, {
        new: true,
      });

      return updated_character;
    } else {
      const new_character = new this.ctx.model.Character(params);
      new_character.id = await this.service.ids.getId('character_id');
      await new_character.save();

      return new_character;
    }
  }
}

module.exports = CharacterService;