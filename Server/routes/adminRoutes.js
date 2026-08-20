const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
  dashboard, getUsers, getAllProjects
} = require("../controllers/adminController");

router.get("/dashboard", protect, authorize("admin"), dashboard);
router.get("/users", protect, authorize("admin"), getUsers);
router.get("/projects", protect, authorize("admin"), getAllProjects);

module.exports = router;