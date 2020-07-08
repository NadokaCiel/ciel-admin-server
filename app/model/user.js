'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const UserSchema = new mongoose.Schema({
    id: Number,
    user_name: {
      type: String,
      Required: '请输入用户名',
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
    password: {
      type: String,
      Required: '请输入密码',
    },
    role: {
      type: String,
      default: 'user',
    },
    userGroup: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
    },
    ccoin: {
      type: Number,
    },
    signed: {
      type: Boolean,
      default: false,
    },
  });

  UserSchema.index({
    id: 1,
  });

  return mongoose.model('User', UserSchema);
};

// const roleMap = {
//   user: '普通用户',
//   admin: '管理员',
//   superadmin: '超级管理员',
//   visitor: '访客',
// };

// const statusMap = {
//   frozen: '已冻结',
//   normal: '正常',
// };
