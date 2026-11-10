const pool = require("../config/db");


const getDailyReport = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                message: "Please provide a date."
            });
        }

        console.log("Logged-in user ID:", req.user.id);
        console.log("Requested date:", date);

        const result = await pool.query(
            `SELECT
                MAX(value) AS highest,
                MIN(value) AS lowest,
                ROUND(AVG(value), 1) AS average,
                COUNT(*) AS total
             FROM readings
             WHERE user_id = $1
             AND reading_date = $2::date`,
            [req.user.id, date]
        );

        const readings = await pool.query(
            `SELECT id, reading_date, time_slot, value
             FROM readings
             WHERE user_id = $1
             AND reading_date = $2::date
             ORDER BY created_at`,
            [req.user.id, date]
        );

        console.log("Daily report result:", result.rows[0]);
        console.log("Daily readings:", readings.rows);

        res.json({
            report: result.rows[0],
            readings: readings.rows
        });

    } catch (error) {
        console.error("Daily report error:", error);

        res.status(500).json({
            message: "Failed to generate daily report."
        });
    }
};



// MONTH TO DATE REPORT
const getMonthToDateReport = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                message: "Please provide a date."
            });
        }

        const result = await pool.query(
            `SELECT
                MAX(value) AS highest,
                MIN(value) AS lowest,
                ROUND(AVG(value), 1) AS average,
                COUNT(*) AS total
             FROM readings
             WHERE user_id = $1
             AND reading_date >= DATE_TRUNC('month', $2::date)::date
             AND reading_date <= $2::date`,
            [req.user.id, date]
        );

        res.json({
            report: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to generate month-to-date report."
        });
    }
};


// PREVIOUS MONTH REPORT
const getMonthlyReport = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                MAX(value) AS highest,
                MIN(value) AS lowest,
                ROUND(AVG(value), 1) AS average,
                COUNT(*) AS total
             FROM readings
             WHERE user_id = $1
             AND reading_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')::date
             AND reading_date < DATE_TRUNC('month', CURRENT_DATE)::date`,
            [req.user.id]
        );

        res.json({
            report: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to generate monthly report."
        });
    }
};


module.exports = {
    getDailyReport,
    getMonthToDateReport,
    getMonthlyReport
};