const express = require("express");

const {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require("../controllers/leaveController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// Employee creates leave
router.post(
  "/",
  protect,
  createLeave
);


// Employee sees own leaves
router.get(
  "/my",
  protect,
  getMyLeaves
);


// HR sees all leaves
router.get(
  "/all",
  protect,
  getAllLeaves
);


// HR approves/rejects leave
router.put(
  "/:id/status",
  protect,
  updateLeaveStatus
);


module.exports = router;