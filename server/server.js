const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const readingsRoutes = require("./routes/readingsRoutes");

app.use("/api/readings", readingsRoutes);

const reportsRoutes = require("./routes/reportsRoutes");

app.use("/api/reports", reportsRoutes);

app.get("/", (req, res) => {
    res.send("Sweety Glucose Tracker API is running!");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            message: "PostgreSQL connected successfully!",
            time: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});