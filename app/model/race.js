'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const RaceSchema = new mongoose.Schema({
    id: Number,
    name: {
      type: String,
      Required: true,
    },
    race: {
      type: String,
      Required: true,
    },
    str_base: {
      type: Number,
      Required: true,
    },
    int_base: {
      type: Number,
      Required: true,
    },
    agi_base: {
      type: Number,
      Required: true,
    },
    fit_base: {
      type: Number,
      Required: true,
    },
    mtl_base: {
      type: Number,
      Required: true,
    },
    atk_rate: {
      type: Number,
      Required: true,
    },
    mag_rate: {
      type: Number,
      Required: true,
    },
    spd_rate: {
      type: Number,
      Required: true,
    },
    def_rate: {
      type: Number,
      Required: true,
    },
    mdf_rate: {
      type: Number,
      Required: true,
    },
    hp_rate: {
      type: Number,
      Required: true,
    },
    mp_rate: {
      type: Number,
      Required: true,
    },
    image: {
      type: String,
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

  RaceSchema.index({
    id: 1,
  });

  return mongoose.model('Race', RaceSchema);
};
