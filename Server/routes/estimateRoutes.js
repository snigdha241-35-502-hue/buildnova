const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  createEstimate, getProjectEstimate
} = require("../controllers/estimateController");

router.post("/", protect, authorize("engineer"), createEstimate);
router.get("/project/:projectId", protect, getProjectEstimate);

module.exports = router;