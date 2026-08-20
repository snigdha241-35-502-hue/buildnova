const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to BuildNOVA Construction Ltd. API" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/engineers", require("./routes/engineerRoutes"));
app.use("/api/estimates", require("./routes/estimateRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`BuildNOVA Server running on http://localhost:${PORT}`);
});