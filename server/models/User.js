const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    employeeId: {
      type: String,
      required: true,
      unique: true
    },

    department: {
      type: String,
      default: "General"
    },
    leaveBalance: {
      type: Number,
      default: 30
    },

    role: {
      type: String,
      enum: ["employee", "hr"],
      default: "employee"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);