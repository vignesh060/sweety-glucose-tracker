const pool = require("../config/db");

// Allowed time slots
const validSlots = [
    "Morning",
    "After breakfast",
    "After lunch",
    "After dinner"
];

// Validate date format and actual calendar date
const isValidDate = (date) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsed = new Date(`${date}T00:00:00Z`);

    return !isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === date;
};

// ADD READING
const addReading = async (req, res) => {
    try {
        const { reading_date, time_slot, value } = req.body;

        if (!reading_date || !time_slot || value === undefined || value === null || value === "") {
            return res.status(400).json({
                message: "Please enter all reading details."
            });
        }

        if (!isValidDate(reading_date)) {
            return res.status(400).json({
                message: "Please enter a valid date."
            });
        }

        if (!Number.isInteger(Number(value)) ||
            Number(value) < 40 || Number(value) > 600) {
            return res.status(400).json({
                message: "Value must be between 40 and 600 mg/dl."
            });
        }

        if (!validSlots.includes(time_slot)) {
            return res.status(400).json({
                message: "Invalid time slot."
            });
        }

        const dateCheck = await pool.query(
            "SELECT $1::date > CURRENT_DATE AS is_future",
            [reading_date]
        );

        if (dateCheck.rows[0].is_future) {
            return res.status(400).json({
                message: "Date cannot be in the future."
            });
        }

        const result = await pool.query(
            `INSERT INTO readings
            (user_id, reading_date, time_slot, value)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [req.user.id, reading_date, time_slot, Number(value)]
        );

        res.status(201).json({
            message: "Reading added successfully!",
            reading: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: `You already have this time slot reading for this date.`
            });
        }

        console.error(error);

        res.status(500).json({
            message: "Failed to add reading."
        });
    }
};


// GET ALL READINGS
const getReadings = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM readings
             WHERE user_id = $1
             ORDER BY reading_date DESC, created_at DESC`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch readings."
        });
    }
};


// UPDATE READING
const updateReading = async (req, res) => {
    try {
        const { id } = req.params;
        const { reading_date, time_slot, value } = req.body;

        if (!reading_date || !time_slot || value === undefined ||
            value === null || value === "") {
            return res.status(400).json({
                message: "Please enter all reading details."
            });
        }

        if (!isValidDate(reading_date)) {
            return res.status(400).json({
                message: "Please enter a valid date."
            });
        }

        if (!Number.isInteger(Number(value)) ||
            Number(value) < 40 || Number(value) > 600) {
            return res.status(400).json({
                message: "Value must be between 40 and 600 mg/dl."
            });
        }

        if (!validSlots.includes(time_slot)) {
            return res.status(400).json({
                message: "Invalid time slot."
            });
        }

        const dateCheck = await pool.query(
            "SELECT $1::date > CURRENT_DATE AS is_future",
            [reading_date]
        );

        if (dateCheck.rows[0].is_future) {
            return res.status(400).json({
                message: "Date cannot be in the future."
            });
        }

        const result = await pool.query(
            `UPDATE readings
             SET reading_date = $1,
                 time_slot = $2,
                 value = $3,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [reading_date, time_slot, Number(value), id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reading not found."
            });
        }

        res.json({
            message: "Reading updated successfully!",
            reading: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "A reading already exists for this time slot and date."
            });
        }

        console.error(error);
        res.status(500).json({
            message: "Failed to update reading."
        });
    }
};


// DELETE READING
const deleteReading = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM readings
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reading not found."
            });
        }

        res.json({
            message: "Reading deleted successfully!"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete reading."
        });
    }
};


module.exports = {
    addReading,
    getReadings,
    updateReading,
    deleteReading
};