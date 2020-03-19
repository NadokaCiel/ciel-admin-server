'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const ItemSchema = new mongoose.Schema({
    id: Number,
    name: {
      type: String,
      Required: 'Kindly enter the name of the item',
    },
    type_id: {
      type: Number,
      Required: 'Kindly enter the type_id of the item',
    },
    quality_id: {
      type: Number,
      Required: 'Kindly enter the quality_id of the item',
    },
    stack: {
      type: Number,
      default: 1,
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

  ItemSchema.index({
    id: 1,
  });

  return mongoose.model('Item', ItemSchema);
};
