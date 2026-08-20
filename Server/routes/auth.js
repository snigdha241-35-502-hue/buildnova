app.post("/api/register", (req, res) => {
    const { email, role, password } = req.body;

    if (!email || !role || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const sql = `
    INSERT INTO users (email, role, password)
    VALUES (?, ?, ?)
  `;

    db.query(sql, [email, role, password], (err, result) => {
        if (err) {
            console.error("Registration error:", err);

            return res.status(500).json({
                success: false,
                message: "Registration failed"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Registration successful!"
        });
    });
});