module.exports = app => {
  const mongoose = app.mongoose;
  const ArticleSchema = new mongoose.Schema({
    id: Number,
    title: {
      type: String,
      Required: 'Kindly enter the title of the article',
    },
    author: {
      type: String,
      Required: 'Kindly enter the author of the article',
    },
    tag: {
      type: Array,
    },
    content: {
      type: String,
      Required: 'Kindly enter the content of the article',
    },
    abstruct: {
      type: String,
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

  ArticleSchema.index({
    id: 1,
  });

  return mongoose.model('Article', ArticleSchema);
};

const statusMap = {
  pending: '待审核',
  audited: '审核通过',
  failed: '审核失败',
}
