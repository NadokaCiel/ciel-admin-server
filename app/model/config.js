'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const ConfigSchema = new mongoose.Schema({
    id: Number,
    ai_option: {
      type: Array,
      Required: 'option needed',
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

  ConfigSchema.index({
    id: 1,
  });

  return mongoose.model('Config', ConfigSchema);
};
