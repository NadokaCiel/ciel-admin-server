'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const ImageSchema = new mongoose.Schema({
    id: Number,
    name: {
      type: String,
      Required: 'Kindly enter the name of the file',
    },
    // path: {
    //   type: String,
    //   Required: 'Kindly enter the path of the folder',
    // },
    url: {
      type: String,
      Required: 'Kindly enter the url of the image',
    },
    // creator: {
    //   type: Object,
    // },
    create_time: {
      type: Date,
      default: Date.now,
    },
  });

  ImageSchema.index({
    id: 1,
  });

  return mongoose.model('Image', ImageSchema);
};