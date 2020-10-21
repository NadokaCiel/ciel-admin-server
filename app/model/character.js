'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const CharacterSchema = new mongoose.Schema({
    id: Number,
    userId: {
      type: Number,
      Required: true,
    },
    name: {
      type: String,
      Required: true,
    },
    gender: {
      type: String,
      Required: true,
    },
    raceId: {
      type: Number,
      Required: true,
    },
    classId: {
      type: Number,
      Required: true,
    },
    // 力量
    str: {
      type: Number,
      Required: true,
    },
    // 智力
    int: {
      type: Number,
      Required: true,
    },
    // 敏捷
    agi: {
      type: Number,
      Required: true,
    },
    // 体能
    fit: {
      type: Number,
      Required: true,
    },
    // 精神
    mtl: {
      type: Number,
      Required: true,
    },
    // 物攻
    atk: {
      type: Number,
      Required: true,
    },
    // 法强
    mag: {
      type: Number,
      Required: true,
    },
    // 速度
    spd: {
      type: Number,
      Required: true,
    },
    // 防御
    def: {
      type: Number,
      Required: true,
    },
    // 魔抗
    mdf: {
      type: Number,
      Required: true,
    },
    // 生命值
    hp: {
      type: Number,
      Required: true,
    },
    // 法力值
    mp: {
      type: Number,
      Required: true,
    },
    // 生命值恢复
    hp_regen: {
      type: Number,
      Required: true,
    },
    // 法力值恢复
    mp_regen: {
      type: Number,
      Required: true,
    },
    // 技能槽
    sp: {
      type: Number,
      Required: true,
    },
    image: {
      type: String,
    },
  });

  CharacterSchema.index({
    id: 1,
  });

  return mongoose.model('Character', CharacterSchema);
};
