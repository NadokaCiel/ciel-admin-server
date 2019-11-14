module.exports = app => {
  const mongoose = app.mongoose;
  const UserSchema = new mongoose.Schema({
    id: Number,
    user_name: {
      type: String,
      Required: 'Kindly enter the name of the user',
    },
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
    },
    password: {
      type: String,
      Required: 'Kindly enter the password of the user',
    },
    role: {
      type: String,
      default: 'user',
    },
    userGroup: {
      type: Array,
      default: [],
    },
  });

  UserSchema.index({
    id: 1,
  });

  return mongoose.model('User', UserSchema);
};
