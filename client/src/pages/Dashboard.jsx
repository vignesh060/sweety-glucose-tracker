
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Activity,
    ChartNoAxesCombined,
    UserRound,
    Settings,
    LogOut,
    Bell,
    Plus,
    TrendingUp,
    TrendingDown,
    Droplets,
    Menu
} from "lucide-react";

import api from "../services/api";
import "../App.css";

// Get today's local date in YYYY-MM-DD format
function getLocalDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function Dashboard() {
    const navigate = useNavigate();

    const [readings, setReadings] = useState([]);

    const [report, setReport] = useState({
        highest: null,
        lowest: null,
        average: null,
        total: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch today's dashboard data from Daily Report API
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const today = getLocalDate();

            const response = await api.get(
                `/reports/daily?date=${today}`
            );

            const responseData = response.data;

            console.log("Daily Report API Response:", responseData);

            const reportData = responseData.report;

            if (!reportData) {
                throw new Error("Report data is missing from API response.");
            }

            // Convert API values into proper numbers
            const highest = reportData.highest !== null
                ? Number(reportData.highest)
                : null;

            const lowest = reportData.lowest !== null
                ? Number(reportData.lowest)
                : null;

            const average = reportData.average !== null
                ? Number(reportData.average)
                : null;

            const total = Number(reportData.total) || 0;

            // Save report statistics
            setReport({
                highest: Number.isFinite(highest) ? highest : null,
                lowest: Number.isFinite(lowest) ? lowest : null,
                average: Number.isFinite(average) ? average : null,
                total
            });

            // Use readings returned by the same API
            const readingList = Array.isArray(responseData.readings)
                ? responseData.readings
                : [];

            setReadings(readingList);

            console.log("Final Report:", {
                highest,
                lowest,
                average,
                total
            });

            console.log("Today's Readings:", readingList);

        } catch (err) {
            console.error("Dashboard Error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load dashboard data."
            );

            setReadings([]);

            setReport({
                highest: null,
                lowest: null,
                average: null,
                total: 0
            });

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Dashboard statistics
    const highest = report.highest;
    const lowest = report.lowest;
    const average = report.average;
    const total = report.total;

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Navigate to readings
    const handleAddReading = () => {
        navigate("/readings");
    };

    // Format reading date in local timezone
    const formatDate = (date) => {
        if (!date) return "--";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const todayLabel = new Date().toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "2-digit",
            year: "numeric"
        }
    );

    // Recent readings
    const recentReadings = [...readings]
        .sort(
            (a, b) =>
                new Date(b.reading_date) -
                new Date(a.reading_date)
        )
        .slice(0, 5);

    return (
        <div className="app">

            {/* Sidebar */}
            <aside className="sidebar">

                <div className="brand">
                    <div className="brand-icon">
                        <Droplets size={25} />
                    </div>

                    <div>
                        <h2>Sweety</h2>
                        <span>GLUCOSE TRACKER</span>
                    </div>
                </div>

                <p className="menu-label">MENU</p>

                <nav>
                    <a className="nav-link active">
                        <LayoutDashboard />
                        Dashboard
                    </a>

                    <a
                        className="nav-link"
                        onClick={handleAddReading}
                    >
                        <Activity />
                        My Readings
                    </a>

                    <a
    className="nav-link"
    onClick={() => navigate("/reports")}
>
    <ChartNoAxesCombined />
    Reports
</a>

                    <a className="nav-link">
                        <UserRound />
                        Profile
                    </a>

                    <a className="nav-link">
                        <Settings />
                        Settings
                    </a>
                </nav>

                <div className="sidebar-bottom">

                    <div className="profile">
                        <div className="avatar">V</div>

                        <div>
                            <strong>Welcome User</strong>
                            <span>Personal Account</span>
                        </div>
                    </div>

                    <button
                        className="nav-link"
                        onClick={handleLogout}
                    >
                        <LogOut />
                        Logout
                    </button>

                </div>

            </aside>

            {/* Main Dashboard */}
            <main className="main">

                {/* Header */}
                <header className="topbar">

                    <div className="mobile-menu">
                        <Menu />
                    </div>

                    <div>
                        <h3>Dashboard</h3>
                        <p>Your health overview at a glance</p>
                    </div>

                    <button className="notification">
                        <Bell size={19} />
                    </button>

                </header>

                {/* Welcome Section */}
                <section className="welcome">

                    <div>
                        <span className="eyebrow">
                            {todayLabel.toUpperCase()}
                        </span>

                        <h1>
                            Welcome back, <span>Vignesh!</span> 👋
                        </h1>

                        <p>
                            Keep tracking. Keep taking care of yourself.
                        </p>
                    </div>

                    <button
                        className="add-button"
                        onClick={handleAddReading}
                    >
                        <Plus size={19} />
                        Add Reading
                    </button>

                </section>

                {/* Loading */}
                {loading && (
                    <p>Loading dashboard data...</p>
                )}

                {/* Statistics */}
                <section className="stats">

                    {/* Average */}
                    <div className="stat-card">

                        <div className="stat-top">
                            <span>Average Glucose</span>

                            <div className="stat-icon purple">
                                <Activity />
                            </div>
                        </div>

                        <h2>
                            {loading ? "--" : average ?? "--"}
                            <small> mg/dL</small>
                        </h2>

                        <p className="muted">
                            Average recorded glucose
                        </p>

                    </div>

                    {/* Highest */}
                    <div className="stat-card">

                        <div className="stat-top">
                            <span>Highest Reading</span>

                            <div className="stat-icon orange">
                                <TrendingUp />
                            </div>
                        </div>

                        <h2>
                            {loading ? "--" : highest ?? "--"}
                            <small> mg/dL</small>
                        </h2>

                        <p className="muted">
                            Highest recorded value
                        </p>

                    </div>

                    {/* Lowest */}
                    <div className="stat-card">

                        <div className="stat-top">
                            <span>Lowest Reading</span>

                            <div className="stat-icon cyan">
                                <TrendingDown />
                            </div>
                        </div>

                        <h2>
                            {loading ? "--" : lowest ?? "--"}
                            <small> mg/dL</small>
                        </h2>

                        <p className="muted">
                            Lowest recorded value
                        </p>

                    </div>

                    {/* Total */}
                    <div className="stat-card">

                        <div className="stat-top">
                            <span>Total Readings</span>

                            <div className="stat-icon green">
                                <Droplets />
                            </div>
                        </div>

                        <h2>
                            {loading ? "--" : total}
                        </h2>

                        <p className="muted">
                            Readings recorded
                        </p>

                    </div>

                </section>

                {/* Error */}
                {error && (
                    <div className="error-message">
                        {error}

                        <button onClick={fetchDashboardData}>
                            Retry
                        </button>
                    </div>
                )}

                {/* Charts and Summary */}
                <section className="content-grid">

                    {/* Glucose Chart */}
                    <div className="panel chart-panel">

                        <div className="panel-heading">
                            <div>
                                <h3>Glucose Overview</h3>
                                <p>Your recent glucose activity</p>
                            </div>

                            <span className="chart-tag">
                                Last 7 days
                            </span>
                        </div>

                        <div className="chart">

                            <div className="chart-labels">
                                <span>200</span>
                                <span>150</span>
                                <span>100</span>
                                <span>50</span>
                            </div>

                            <svg
                                viewBox="0 0 600 210"
                                preserveAspectRatio="none"
                            >

                                <defs>
                                    <linearGradient
                                        id="chartFill"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#9b7cff"
                                            stopOpacity=".35"
                                        />

                                        <stop
                                            offset="100%"
                                            stopColor="#9b7cff"
                                            stopOpacity="0"
                                        />
                                    </linearGradient>
                                </defs>

                                {[20, 70, 120, 170].map(y => (
                                    <line
                                        key={y}
                                        x1="0"
                                        y1={y}
                                        x2="600"
                                        y2={y}
                                        stroke="#29334a"
                                        strokeDasharray="5 6"
                                    />
                                ))}

                                <path
                                    d="M0 125 C40 110 50 90 100 105 S170 150 200 115 S270 70 300 90 S370 130 400 95 S470 45 500 75 S560 105 600 55 L600 190 L0 190 Z"
                                    fill="url(#chartFill)"
                                />

                                <path
                                    d="M0 125 C40 110 50 90 100 105 S170 150 200 115 S270 70 300 90 S370 130 400 95 S470 45 500 75 S560 105 600 55"
                                    fill="none"
                                    stroke="#a78bfa"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />

                            </svg>

                        </div>

                        <div className="chart-days">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>

                    </div>

                    {/* Quick Summary */}
                    <div className="panel quick-panel">

                        <h3>Quick Summary</h3>
                        <p>Your reading activity</p>

                        <div className="summary-number">
                            {loading ? "--" : readings.length}
                            <span>readings</span>
                        </div>

                        <div className="summary-progress">
                            <div
                                style={{
                                    width: readings.length
                                        ? "100%"
                                        : "0%"
                                }}
                            />
                        </div>

                        {[
                            "Morning",
                            "After breakfast",
                            "After lunch",
                            "After dinner"
                        ].map(slot => {

                            const count = readings.filter(
                                item => item.time_slot === slot
                            ).length;

                            return (
                                <div
                                    className="summary-row"
                                    key={slot}
                                >
                                    <span>{slot}</span>

                                    <strong>
                                        {loading ? "--" : count}
                                    </strong>
                                </div>
                            );
                        })}

                    </div>

                </section>

                {/* Recent Readings */}
                <section className="panel readings-panel">

                    <div className="panel-heading">

                        <div>
                            <h3>Recent Readings</h3>
                            <p>Your latest glucose records</p>
                        </div>

                        <button
                            className="add-button"
                            onClick={fetchDashboardData}
                        >
                            Refresh
                        </button>

                    </div>

                    <div className="table-wrap">

                        <table>

                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time Slot</th>
                                    <th>Glucose Value</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {loading ? (
                                    <tr>
                                        <td colSpan="4">
                                            Loading readings...
                                        </td>
                                    </tr>
                                ) : recentReadings.length === 0 ? (
                                    <tr>
                                        <td colSpan="4">
                                            No readings recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    recentReadings.map(item => (
                                        <tr key={item.id}>

                                            <td>
                                                {formatDate(item.reading_date)}
                                            </td>

                                            <td>
                                                {item.time_slot}
                                            </td>

                                            <td>
                                                <strong>
                                                    {item.value} mg/dL
                                                </strong>
                                            </td>

                                            <td>
                                                <span className="status">
                                                    Recorded
                                                </span>
                                            </td>

                                        </tr>
                                    ))
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;
