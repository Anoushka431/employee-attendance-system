const Leave = require("../models/Leave");
const User = require("../models/User");

const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const difference =
    end.getTime() - start.getTime();

  return (
    Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ) + 1
  );
};


// Employee creates leave request
const createLeave = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      reason
    } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({
        message: "End date cannot be before start date"
      });
    }

    const numberOfDays = calculateDays(
      startDate,
      endDate
    );

    const leave = await Leave.create({
      employee: req.user.userId,
      startDate,
      endDate,
      numberOfDays,
      reason,
      status: "Pending"
    });

    res.status(201).json({
      message: "Leave request submitted successfully",
      leave
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to submit leave request",
      error: error.message
    });
  }
};


// Employee sees own leaves
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employee: req.user.userId
    }).sort({
      createdAt: -1
    });

    const employee = await User.findById(
      req.user.userId
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    // Give old employees the default balance
    if (employee.leaveBalance == null) {
      employee.leaveBalance = 30;
      await employee.save();
    }

    res.json({
      leaves,
      leaveBalance: employee.leaveBalance
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to load leaves",
      error: error.message
    });
  }
};


// HR sees all leave requests
const getAllLeaves = async (req, res) => {
  try {

    if (req.user.role !== "hr") {
      return res.status(403).json({
        message: "HR access required"
      });
    }

    const leaves = await Leave.find()
      .populate(
        "employee",
        "name email employeeId department"
      )
      .sort({
        createdAt: -1
      });

    res.json({
      leaves
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to load all leaves",
      error: error.message
    });
  }
};


// HR approves/rejects leave
const updateLeaveStatus = async (req, res) => {
  try {

    if (req.user.role !== "hr") {
      return res.status(403).json({
        message: "HR access required"
      });
    }

    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid leave status"
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }

    // Prevent changing an already processed request
    if (leave.status !== "Pending") {
      return res.status(400).json({
        message: `Leave is already ${leave.status.toLowerCase()}`
      });
    }

    // If HR approves the leave
    if (status === "Approved") {

      const employee = await User.findById(
        leave.employee
      );

      if (!employee) {
        return res.status(404).json({
          message: "Employee not found"
        });
      }

      // Give old employees the default balance
      if (employee.leaveBalance == null) {
        employee.leaveBalance = 30;
      }

      // Check available leave balance
      if (
        employee.leaveBalance <
        leave.numberOfDays
      ) {
        return res.status(400).json({
          message: "Insufficient leave balance"
        });
      }

      // Deduct leave days
      employee.leaveBalance -= leave.numberOfDays;

      await employee.save();
    }

    // Update leave status
    leave.status = status;

    await leave.save();

    res.json({
      message: `Leave ${status.toLowerCase()} successfully`,
      leave
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update leave status",
      error: error.message
    });
  }
};


module.exports = {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
};