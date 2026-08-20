const db = require("./config/db");
const bcrypt = require("bcryptjs");

async function seedAdmin() {
  const email = "admin@buildnova.com";
  const password = "Admin@123";

  try {
    const hash = await bcrypt.hash(password, 10);

    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE users
         SET password = ?, role = 'admin', name = ?
         WHERE email = ?`,
        [hash, "BuildNOVA Admin", email]
      );

      console.log("================================");
      console.log("Admin account RESET successfully!");
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("Role: admin");
      console.log("================================");

    } else {
      await db.query(
        `INSERT INTO users
        (name, email, password, phone, role)
        VALUES (?, ?, ?, ?, 'admin')`,
        [
          "BuildNOVA Admin",
          email,
          hash,
          "+8801700000000"
        ]
      );

      console.log("================================");
      console.log("Admin account CREATED successfully!");
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("Role: admin");
      console.log("================================");
    }

  } catch (error) {
    console.error("Admin setup failed:", error.message);

  } finally {
    await db.end();
  }
}

seedAdmin();