module.exports = app => {
  const mongoose = app.mongoose;
  const IdsSchema = new mongoose.Schema({
    name: {
      type: String,
      Required: 'Id of item needs name!',
    },
    nowId: {
      type: Number,
      default: 1,
    },
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
    },
  });

  IdsSchema.index({
    id: 1,
  });

  return mongoose.model('Ids', IdsSchema);
};
