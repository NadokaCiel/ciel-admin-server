'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const QualitySchema = new mongoose.Schema({
    id: Number,
    name: {
      type: String,
      Required: 'Kindly enter the name of the quality',
    },
    quality: {
      type: String,
      Required: 'Kindly enter the quality',
    },
    color: {
      type: String,
      Required: 'Kindly enter the color of the quality',
    },
    mark: {
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

  QualitySchema.index({
    id: 1,
  });

  return mongoose.model('Quality', QualitySchema);
};
