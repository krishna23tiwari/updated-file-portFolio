const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true
  },
  
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, {
  timestamps: true, versionKey : false
});

const User = mongoose.model("User", userSchema);

module.exports = User;
