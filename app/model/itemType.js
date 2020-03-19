'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const ItemTypeSchema = new mongoose.Schema({
    id: Number,
    name: {
      type: String,
      Required: 'Kindly enter the name of the type',
    },
    type: {
      type: String,
      Required: 'Kindly enter the type',
    },
    mark: {
      type: String,
    },
    image: {
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

  ItemTypeSchema.index({
    id: 1,
  });

  return mongoose.model('ItemType', ItemTypeSchema);
};
