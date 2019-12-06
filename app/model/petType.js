'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const PetTypeSchema = new mongoose.Schema({
    id: Number,
    name: {
      type: String,
      Required: true,
    },
    type: {
      type: String,
      Required: true,
    },
    icon: {
      type: String,
      Required: true,
    },
    desc: {
      type: String,
      default: '',
    },
    // 基础货币消耗
    basePrice: {
      type: Number,
      Required: true,
    },
    // 基础好感度 取值范围（0~50）
    baseFond: {
      type: Number,
      Required: true,
    },
    // 好感度上升倍率，取值范围（0~2），代表每次好感度结算时的倍率
    fondRate: {
      type: Number,
      Required: true,
    },
    // 清洁频率，取值范围（1~10），代表一天内需要清洁的最多次数
    cleanRate: {
      type: Number,
      Required: true,
    },
    // 进食频率，取值范围（1~10），代表一天内需要进食的最多次数
    feedRate: {
      type: Number,
      Required: true,
    },
    // 当天玩耍获取好感度次数上限，取值范围（1~10)
    playLimit: {
      type: Number,
      Required: true,
    },
    // 当天对话获取好感度次数上限，取值范围（1~10)
    talkLimit: {
      type: Number,
      Required: true,
    },
    // 当天访问宠物页面的获取好感度次数上限，取值范围（1~10)
    visitLimit: {
      type: Number,
      Required: true,
    },
    status: {
      type: String,
      default: 'frozen',
    },
    creator: {
      type: Object,
    },
    create_time: {
      type: Date,
      default: Date.now,
    },
    updater: {
      type: Object,
    },
    update_time: {
      type: Date,
    },
  });

  PetTypeSchema.index({
    id: 1,
  });

  return mongoose.model('PetType', PetTypeSchema);
};

// const statusMap = {
//   available: '可用',
//   frozen: '冻结',
// };
