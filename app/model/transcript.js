'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const TranscriptSchema = new mongoose.Schema({
    id: Number,
    quiz_id: Number,
    title: {
      type: String,
      Required: 'Kindly enter the title of the transcript',
    },
    cover: {
      type: String,
    },
    user_id: {
      type: String,
      Required: 'Kindly enter the user_id of transcript',
    },
    user_name: {
      type: String,
      Required: 'Kindly enter the user_name of transcript',
    },
    user_avatar: {
      type: String,
      Required: 'Kindly enter the user_avatar of transcript',
    },
    sheet: {
      type: Object,
    },
    score: Number,
    create_time: {
      type: Date,
      default: Date.now,
    },
  });

  TranscriptSchema.index({
    id: 1,
  });

  return mongoose.model('Transcript', TranscriptSchema);
};

// const statusMap = {
//   pending: '待审核',
//   audited: '审核通过',
//   failed: '审核失败',
// };
