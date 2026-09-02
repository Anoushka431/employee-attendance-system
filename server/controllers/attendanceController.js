const Attendance = require("../models/Attendance");

const getToday = () => {
  const now = new Date();

  return now.toISOString().split("T")[0];
};


const checkIn = async (req, res) => {
  try {
    const date = getToday();

    let attendance = await Attendance.findOne({
      employee: req.user.userId,
      date
    });

    if (attendance && attendance.checkIn) {
      return res.status(400).json({
        message: "Already checked in today"
      });
    }

    if (!attendance) {
      attendance = new Attendance({
        employee: req.user.userId,
        date,
        checkIn: new Date(),
        status: "Present"
      });
    } else {
      attendance.checkIn = new Date();
      attendance.status = "Present";
    }

    await attendance.save();

    res.json({
      message: "Check-in successful",
      attendance
    });

  } catch (error) {
    res.status(500).json({
      message: "Check-in failed",
      error: error.message
    });
  }
};


const checkOut = async (req, res) => {
  try {
    const date = getToday();

    const attendance = await Attendance.findOne({
      employee: req.user.userId,
      date
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({
        message: "Please check in first"
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        message: "Already checked out today"
      });
    }

    const checkOutTime = new Date();

    const difference =
      checkOutTime.getTime() -
      attendance.checkIn.getTime();

    const workingMinutes =
      Math.floor(difference / (1000 * 60));

    attendance.checkOut = checkOutTime;
    attendance.workingMinutes = workingMinutes;

    if (workingMinutes < 240) {
      attendance.status = "Half Day";
    } else {
      attendance.status = "Present";
    }

    await attendance.save();

    res.json({
      message: "Check-out successful",
      attendance
    });

  } catch (error) {
    res.status(500).json({
      message: "Check-out failed",
      error: error.message
    });
  }
};


const getTodayAttendance = async (req, res) => {
  try {
    const date = getToday();

    const attendance = await Attendance.findOne({
      employee: req.user.userId,
      date
    });

    res.json({
      attendance
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get attendance"
    });
  }
};


const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      employee: req.user.userId
    }).sort({ date: -1 });

    res.json({
      attendance
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to get attendance history"
    });
  }
};

// HR sees all attendance records
const getAllAttendance = async (req, res) => {
  try {
    if (req.user.role !== "hr") {
      return res.status(403).json({
        message: "HR access required"
      });
    }

    const attendance = await Attendance.find()
      .populate(
        "employee",
        "name email employeeId department"
      )
      .sort({
        date: -1
      });

    res.json({
      attendance
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to load all attendance",
      error: error.message
    });
  }
};


module.exports = {
  checkIn,
  checkOut,
  getTodayAttendance,
  getMyAttendance,
  getAllAttendance
};