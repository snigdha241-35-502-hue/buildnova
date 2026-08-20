const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= CREATE JWT TOKEN =================
const createToken = (id, role) => {
  return jwt.sign(
    {
      id: id,
      role: role
    },
    process.env.JWT_SECRET || "buildnova_secret_key",
    {
      expiresIn: "7d"
    }
  );
};


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role
    } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    // Clean email
    const cleanEmail = email.trim().toLowerCase();

    // Allowed roles
    let userRole = "customer";

    if (role === "engineer") {
      userRole = "engineer";
    }

    // Check existing email
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE LOWER(email) = ?",
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Insert user
    const [result] = await db.query(
      `INSERT INTO users
      (name, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?)`,
      [
        name.trim(),
        cleanEmail,
        hashedPassword,
        phone || null,
        userRole
      ]
    );

    // Create JWT
    const token = createToken(
      result.insertId,
      userRole
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,

      user: {
        id: result.insertId,
        name: name.trim(),
        email: cleanEmail,
        phone: phone || null,
        role: userRole
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const {
      email,
      password,
      role
    } = req.body;

    // Required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Clean email
    const cleanEmail = email.trim().toLowerCase();

    // Find user
    const [users] = await db.query(
      `SELECT id, name, email, password, phone, role
       FROM users
       WHERE LOWER(email) = ?`,
      [cleanEmail]
    );

    // User not found
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = users[0];

    // Check password
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Optional role check
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as ${user.role}`
      });
    }

    // Create JWT
    const token = createToken(
      user.id,
      user.role
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};


// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {

    const [users] = await db.query(
      `SELECT
        id,
        name,
        email,
        phone,
        role,
        created_at
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user: users[0]
    });

  } catch (error) {
    console.error("PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load profile",
      error: error.message
    });
  }
};