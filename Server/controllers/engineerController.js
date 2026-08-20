const db = require("../config/db");

exports.getEngineers = async (req, res) => {
  try {
    const [engineers] = await db.query(
      `SELECT id, name, email, phone FROM users WHERE role = 'engineer' ORDER BY name`
    );
    res.json({ success: true, engineers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectRequests = async (req, res) => {
  try {
    const [projects] = await db.query(
      `SELECT p.*, u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone
       FROM projects p JOIN users u ON p.customer_id = u.id
       WHERE p.status = 'Pending' ORDER BY p.created_at DESC`
    );
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignEngineer = async (req, res) => {
  try {
    const { engineer_id } = req.body;
    const [engineer] = await db.query(
      `SELECT id FROM users WHERE id = ? AND role = 'engineer'`, [engineer_id]
    );
    if (!engineer.length) {
      return res.status(404).json({ success: false, message: "Engineer not found" });
    }
    await db.query(
      `UPDATE projects SET engineer_id = ?, status = 'Engineer Assigned' WHERE id = ?`,
      [engineer_id, req.params.id]
    );
    res.json({ success: true, message: "Engineer assigned successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEngineerProjects = async (req, res) => {
  try {
    const [projects] = await db.query(
      `SELECT p.*, u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone
       FROM projects p JOIN users u ON p.customer_id = u.id
       WHERE p.engineer_id = ? ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};