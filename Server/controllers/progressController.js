const db = require("../config/db");

exports.updateProgress = async (req, res) => {
  try {
    const { project_id, progress_percentage, description } = req.body;
    const progress = Number(progress_percentage);

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false, message: "Progress must be between 0 and 100"
      });
    }

    await db.query(
      `INSERT INTO progress (project_id, engineer_id, progress_percentage, description)
       VALUES (?, ?, ?, ?)`,
      [project_id, req.user.id, progress, description || null]
    );

    const status = progress === 100 ? "Completed" : "Construction";

    await db.query(
      `UPDATE projects SET progress = ?, status = ? WHERE id = ?`,
      [progress, status, project_id]
    );

    res.json({ success: true, message: "Construction progress updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProgressHistory = async (req, res) => {
  try {
    const [history] = await db.query(
      `SELECT p.*, u.name AS engineer_name
       FROM progress p JOIN users u ON p.engineer_id = u.id
       WHERE p.project_id = ? ORDER BY p.updated_at DESC`,
      [req.params.projectId]
    );
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};