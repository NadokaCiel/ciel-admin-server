const Service = require('egg').Service;

const basic = {
  hp: 30,
  mp: 20,
};

class GameToolService extends Service {
  async createCharacter({
    userId,
    raceId,
    classId,
    name,
  }) {
    // const user = await this.service.user.find(userId);
    
    const character = await this.getStatus({
      raceId,
      classId,
    });
    character.name = name;
    character.userId = userId;
    const new_character = await this.service.character.save(character);

    return new_character;
  }

  async changeClass({
    characterId,
    classId,
  }) {
    const old_character = await this.service.character.find(characterId);
    
    const character = await this.getStatus({
      raceId: old_character.raceId,
      classId,
    });
    const updated_character = await this.service.character.save({
      id: characterId,
      ...character,
    });

    return updated_character;
  }

  async getStatus({
    raceId,
    classId,
    equipmentId,
  }) {
    const race = await this.service.race.find(raceId);
    const rank = await this.service.class.find(classId);

    // 基础设置
    let character = {
      raceId: race.id,
      classId: rank.id,

      // 基础属性
      str: race.str_base + rank.str_base,
      int: race.int_base + rank.int_base,
      agi: race.agi_base + rank.agi_base,
      fit: race.fit_base + rank.fit_base,
      mtl: race.mtl_base + rank.mtl_base,

      // 基础加成比例
      atk_rate: race.atk_rate + rank.atk_rate,
      mag_rate: race.mag_rate + rank.mag_rate,
      spd_rate: race.spd_rate + rank.spd_rate,
      def_rate: race.def_rate + rank.def_rate,
      mdf_rate: race.mdf_rate + rank.mdf_rate,
      hp_rate: race.hp_rate + rank.hp_rate,
      mp_rate: race.mp_rate + rank.mp_rate,
    };

    // TODO
    // if (equipmentId) {}

    return character;
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

module.exports = GameToolService;