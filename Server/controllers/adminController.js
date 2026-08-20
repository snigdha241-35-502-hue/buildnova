const db = require("../config/db");

exports.dashboard = async (req, res) => {
  try {
    const [[users]] = await db.query(`SELECT COUNT(*) AS total FROM users`);
    const [[customers]] = await db.query(`SELECT COUNT(*) AS total FROM users WHERE role = 'customer'`);
    const [[engineers]] = await db.query(`SELECT COUNT(*) AS total FROM users WHERE role = 'engineer'`);
    const [[projects]] = await db.query(`SELECT COUNT(*) AS total FROM projects`);
    const [[pending]] = await db.query(`SELECT COUNT(*) AS total FROM projects WHERE status = 'Pending'`);
    const [[completed]] = await db.query(`SELECT COUNT(*) AS total FROM projects WHERE status = 'Completed'`);

    res.json({
      success: true,
      dashboard: {
        totalUsers: users.total,
        totalCustomers: customers.total,
        totalEngineers: engineers.total,
        totalProjects: projects.total,
        pendingProjects: pending.total,
        completedProjects: completed.total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC`
    );
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await db.query(
      `SELECT p.*, c.name AS customer_name, e.name AS engineer_name
       FROM projects p JOIN users c ON p.customer_id = c.id
       LEFT JOIN users e ON p.engineer_id = e.id
       ORDER BY p.created_at DESC`
    );
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};