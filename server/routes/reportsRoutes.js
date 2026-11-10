const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
    getDailyReport,
    getMonthToDateReport,
    getMonthlyReport
} = require("../controllers/reportsController");

router.use(authenticateToken);

router.get("/daily", getDailyReport);
router.get("/month-to-date", getMonthToDateReport);
router.get("/monthly", getMonthlyReport);

module.exports = router;