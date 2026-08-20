const db = require("../config/db");

exports.createEstimate = async (req, res) => {
  try {
    const {
      project_id, material_cost, labor_cost, design_cost, other_cost, notes
    } = req.body;

    const material = Number(material_cost) || 0;
    const labor = Number(labor_cost) || 0;
    const design = Number(design_cost) || 0;
    const other = Number(other_cost) || 0;
    const total = material + labor + design + other;

    const [result] = await db.query(
      `INSERT INTO estimates
       (project_id, engineer_id, material_cost, labor_cost, design_cost, other_cost, total_cost, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [project_id, req.user.id, material, labor, design, other, total, notes || null]
    );

    await db.query(
      `UPDATE projects SET status = 'Estimate Ready' WHERE id = ?`, [project_id]
    );

    res.status(201).json({
      success: true, message: "Cost estimate created successfully",
      estimateId: result.insertId, total_cost: total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectEstimate = async (req, res) => {
  try {
    const [estimates] = await db.query(
      `SELECT e.*, u.name AS engineer_name
       FROM estimates e JOIN users u ON e.engineer_id = u.id
       WHERE e.project_id = ? ORDER BY e.created_at DESC`,
      [req.params.projectId]
    );
    res.json({ success: true, estimates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};