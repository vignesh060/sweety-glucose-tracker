
import { useState } from "react";
import api from "../services/api";
import "../App.css";

function getLocalDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function Reports() {
    const [reportType, setReportType] = useState("daily");
    const [date, setDate] = useState(getLocalDate());
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError("");
            setReport(null);

            const endpoint = {
                daily: "/reports/daily",
                "month-to-date": "/reports/month-to-date",
                monthly: "/reports/monthly"
            }[reportType];

            const response = await api.get(endpoint, {
                params: reportType === "monthly" ? {} : { date }
            });

            setReport(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load report."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <main className="main">
                <header className="topbar">
                    <div>
                        <h3>Reports</h3>
                        <p>View your glucose reports</p>
                    </div>

                    <button onClick={() => window.location.href = "/dashboard"}>
                        Dashboard
                    </button>
                </header>

                <section className="panel">
                    <h3>Select Report</h3>

                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="daily">Daily Report</option>
                        <option value="month-to-date">Month-to-Date Report</option>
                        <option value="monthly">Previous Month Report</option>
                    </select>

                    {reportType !== "monthly" && (
                        <div>
                            <label>Select Date</label>
                            <input
                                type="date"
                                value={date}
                                max={getLocalDate()}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    )}

                    <button onClick={fetchReport} disabled={loading}>
                        {loading ? "Loading..." : "Generate Report"}
                    </button>
                </section>

                {error && <p className="error-message">{error}</p>}

                {report && (
                    <>
                        <section className="stats">
                            {[
                                ["Highest", report.report.highest],
                                ["Lowest", report.report.lowest],
                                ["Average", report.report.average],
                                ["Total Readings", report.report.total]
                            ].map(([label, value]) => (
                                <div className="stat-card" key={label}>
                                    <span>{label}</span>
                                    <h2>
                                        {value === null ? "--" : value}
                                        {label !== "Total Readings" && (
                                            <small> mg/dL</small>
                                        )}
                                    </h2>
                                </div>
                            ))}
                        </section>

                        {reportType === "daily" && (
                            <section className="panel">
                                <h3>Daily Readings</h3>

                                {report.readings.length === 0 ? (
                                    <p>No readings for this date.</p>
                                ) : (
                                    <div className="table-wrap">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Time Slot</th>
                                                    <th>Value</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {report.readings.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            {new Date(item.reading_date).toLocaleDateString("en-IN")}
                                                        </td>
                                                        <td>{item.time_slot}</td>
                                                        <td>{item.value} mg/dL</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default Reports;
