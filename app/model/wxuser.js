'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const WxuserSchema = new mongoose.Schema({
    id: Number,
    openid: {
      type: String,
      Required: '请输入openid',
    },
    unionid: {
      type: String,
    },
    userid: {
      type: Number,
    },
    user_name: {
      type: String,
    },
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
    },
    visit_time: {
      type: Date,
    },
  });

  WxuserSchema.index({
    id: 1,
  });

  return mongoose.model('Wxuser', WxuserSchema);
};

