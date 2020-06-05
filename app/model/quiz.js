'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const QuizSchema = new mongoose.Schema({
    id: Number,
    title: {
      type: String,
      Required: 'Kindly enter the title of the quiz',
    },
    author: {
      type: String,
      Required: 'Kindly enter the author of quiz',
    },
    cover: {
      type: String,
    },
    qrcode_url: {
      type: String,
    },
    subjects: {
      type: Array,
    },
    status: {
      type: String,
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

  QuizSchema.index({
    id: 1,
  });

  return mongoose.model('Quiz', QuizSchema);
};

// const statusMap = {
//   pending: '待审核',
//   audited: '审核通过',
//   failed: '审核失败',
// };
