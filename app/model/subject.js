'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const SubjectSchema = new mongoose.Schema({
    id: Number,
    title: {
      type: String,
      Required: 'Kindly enter the title of the subject',
    },
    content: {
      type: String,
      Required: 'Kindly enter the content of the subject',
    },
    type: {
      type: String,
      Required: 'Kindly enter the type of subject',
    },
    options: {
      type: Array,
    },
    answer: {
      type: Array,
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

  SubjectSchema.index({
    id: 1,
  });

  return mongoose.model('Subject', SubjectSchema);
};

// const typeMap = {
//   select: '单选',
//   'multi_select': '多选',
// };