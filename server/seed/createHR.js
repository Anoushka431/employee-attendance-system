require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const createHR = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const existingHR = await User.findOne({
      email: "hr@company.com"
    });

    if (existingHR) {
      console.log("HR account already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "HR@123456",
      10
    );

    const hr = await User.create({
      name: "HR Manager",
      email: "hr@company.com",
      password: hashedPassword,
      employeeId: "HR001",
      department: "Human Resources",
      role: "hr"
    });

    console.log("HR account created successfully");
    console.log("Email:", hr.email);
    console.log("Employee ID:", hr.employeeId);

    process.exit(0);

  } catch (error) {
    console.error(
      "Failed to create HR:",
      error.message
    );

    process.exit(1);
  }
};

createHR();