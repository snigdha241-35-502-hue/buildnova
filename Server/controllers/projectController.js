const db = require("../config/db");

exports.createProject = async (req, res) => {
  try {
    const {
      project_name, building_type, location, land_size,
      number_of_floors, number_of_rooms, budget, requirements
    } = req.body;

    if (!project_name || !building_type || !location) {
      return res.status(400).json({
        success: false,
        message: "Project name, building type and location are required"
      });
    }

    const [result] = await db.query(
      `INSERT INTO projects
       (customer_id, project_name, building_type, location, land_size,
        number_of_floors, number_of_rooms, budget, requirements)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, project_name, building_type, location,
        land_size || null, number_of_floors || 1, number_of_rooms || 0,
        budget || 0, requirements || null
      ]
    );

    res.status(201).json({
      success: true,
      message: "Project request submitted successfully",
      projectId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const [projects] = await db.query(
      `SELECT p.*, e.name AS engineer_name, e.email AS engineer_email, e.phone AS engineer_phone
       FROM projects p
       LEFT JOIN users e ON p.engineer_id = e.id
       WHERE p.customer_id = ?
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const [projects] = await db.query(
      `SELECT p.*, c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone,
              e.name AS engineer_name, e.email AS engineer_email, e.phone AS engineer_phone
       FROM projects p
       JOIN users c ON p.customer_id = c.id
       LEFT JOIN users e ON p.engineer_id = e.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (!projects.length) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, project: projects[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, progress = 0 } = req.body;
    await db.query(
      `UPDATE projects SET status = ?, progress = ? WHERE id = ?`,
      [status, progress, req.params.id]
    );
    res.json({ success: true, message: "Project status updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};