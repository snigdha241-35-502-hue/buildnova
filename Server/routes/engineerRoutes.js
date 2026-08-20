const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  getEngineers, getProjectRequests, assignEngineer, getEngineerProjects
} = require("../controllers/engineerController");

router.get("/", protect, authorize("admin"), getEngineers);
router.get("/project-requests", protect, authorize("engineer", "admin"), getProjectRequests);
router.put("/assign/:id", protect, authorize("admin"), assignEngineer);
router.get("/my-projects", protect, authorize("engineer"), getEngineerProjects);

module.exports = router;