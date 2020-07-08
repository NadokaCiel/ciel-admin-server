'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const SigninSchema = new mongoose.Schema({
    id: Number,
    user_id: Number,
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
    },
    serial: {
      type: Number,
      default: 0,
    },
  });

  SigninSchema.index({
    id: 1,
  });

  return mongoose.model('Signin', SigninSchema);
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
