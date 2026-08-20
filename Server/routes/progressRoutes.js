const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  updateProgress, getProgressHistory
} = require("../controllers/progressController");

router.post("/", protect, authorize("engineer"), updateProgress);
router.get("/project/:projectId", protect, getProgressHistory);

module.exports = router;