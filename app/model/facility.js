'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const FacilitySchema = new mongoose.Schema({
    id: Number,
    userid: {
      type: Number,
    },
    // 农场
    farm_base: {
      type: Number,
      default: 0,
    },
    farm_level: {
      type: Number,
      default: 0,
    },
    // 伐木场
    forestry_base: {
      type: Number,
      default: 0,
    },
    forestry_level: {
      type: Number,
      default: 0,
    },
    // 采石场
    quarry_base: {
      type: Number,
      default: 0,
    },
    quarry_level: {
      type: Number,
      default: 0,
    },
    // 加工厂
    refinery_base: {
      type: Number,
      default: 0,
    },
    refinery_level: {
      type: Number,
      default: 0,
    },
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
    },
  });

  FacilitySchema.index({
    id: 1,
  });

  return mongoose.model('Facility', FacilitySchema);
};

