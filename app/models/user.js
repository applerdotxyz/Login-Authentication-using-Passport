import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  local: {
    username: String,
    password: String,
  },
});

module.exports = mongoose.model('User', userSchema);
