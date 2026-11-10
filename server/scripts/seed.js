
const pool = require("../config/db");
const bcrypt = require("bcrypt");

const seedDatabase = async () => {
    try {
        const name = "Demo User";
        const email = "demo@sweety.com";
        const password = "Demo@123";

        // Check whether demo user already exists
        let userResult = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        let userId;

        if (userResult.rows.length > 0) {
            userId = userResult.rows[0].id;
            console.log("Demo user already exists.");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await pool.query(
                `INSERT INTO users (name, email, password_hash)
                 VALUES ($1, $2, $3)
                 RETURNING id`,
                [name, email, hashedPassword]
            );

            userId = newUser.rows[0].id;
            console.log("Demo user created.");
        }

        // Add sample readings only if the demo user has none
        const existingReadings = await pool.query(
            "SELECT COUNT(*) FROM readings WHERE user_id = $1",
            [userId]
        );

        if (Number(existingReadings.rows[0].count) === 0) {
            const sampleReadings = [
                ["2026-11-08", "Morning", 110],
                ["2026-11-08", "After breakfast", 145],
                ["2026-11-08", "After lunch", 130],
                ["2026-11-08", "After dinner", 120]
            ];

            for (const reading of sampleReadings) {
                await pool.query(
                    `INSERT INTO readings
                     (user_id, reading_date, time_slot, value)
                     VALUES ($1, $2, $3, $4)`,
                    [userId, ...reading]
                );
            }

            console.log("Sample readings inserted.");
        } else {
            console.log("Demo user already has readings. Skipping.");
        }

        console.log("Database seeding completed.");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await pool.end();
    }
};

seedDatabase();
