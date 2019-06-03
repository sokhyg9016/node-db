const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const userSchema = new Schema(
{
    email: 
    {
      type: String,
      required: true,
    },
    nick: 
    {
      type: String,
      required: true,
    },
    password: String,
    createdAt: 
    {
      type: Date,
      default: Date.now,
    },
});

module.exports = mongoose.model('user', userSchema);
