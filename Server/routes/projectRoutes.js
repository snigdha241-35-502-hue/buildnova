const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  createProject, getMyProjects, getProject, updateStatus
} = require("../controllers/projectController");

router.post("/", protect, authorize("customer"), createProject);
router.get("/my-projects", protect, authorize("customer"), getMyProjects);
router.get("/:id", protect, getProject);
router.put("/:id/status", protect, authorize("engineer", "admin"), updateStatus);

module.exports = router;