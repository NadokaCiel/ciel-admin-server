'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const PriceSchema = new mongoose.Schema({
    id: Number,
    itemid: {
      type: Number,
    },
    currency: {
      type: Number,
      default: 0,
    },
    food: {
      type: Number,
      default: 0,
    },
    fabric: {
      type: Number,
      default: 0,
    },
    lumber: {
      type: Number,
      default: 0,
    },
    stone: {
      type: Number,
      default: 0,
    },
    gemstone: {
      type: Number,
      default: 0,
    },
    // 红 红宝石
    ruby: {
      type: Number,
      default: 0,
    },
    // 橙 琥珀
    amber: {
      type: Number,
      default: 0,
    },
    // 黄 黄玉
    topaz: {
      type: Number,
      default: 0,
    },
    // 绿 祖母绿
    emerald: {
      type: Number,
      default: 0,
    },
    // 蓝 蓝宝石
    sapphire: {
      type: Number,
      default: 0,
    },
    // 靛 青金石
    lazurite: {
      type: Number,
      default: 0,
    },
    // 紫 紫水晶
    amethyst: {
      type: Number,
      default: 0,
    },
    // 金刚石
    diamond: {
      type: Number,
      default: 0,
    },
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
    },
  });

  PriceSchema.index({
    id: 1,
  });

  return mongoose.model('Price', PriceSchema);
};

