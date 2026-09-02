const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    date: {
      type: String,
      required: true
    },

    checkIn: {
      type: Date,
      default: null
    },

    checkOut: {
      type: Date,
      default: null
    },

    workingMinutes: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day", "Leave"],
      default: "Present"
    }
  },
  {
    timestamps: true
  }
);

attendanceSchema.index(
  { employee: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);