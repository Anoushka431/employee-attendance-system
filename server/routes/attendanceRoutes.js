const express = require("express");

const {
  checkIn,
  checkOut,
  getTodayAttendance,
  getMyAttendance,
  getAllAttendance
} = require("../controllers/attendanceController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/check-in", protect, checkIn);

router.post("/check-out", protect, checkOut);

router.get("/today", protect, getTodayAttendance);

router.get("/my", protect, getMyAttendance);

router.get("/all", protect, getAllAttendance);

module.exports = router;