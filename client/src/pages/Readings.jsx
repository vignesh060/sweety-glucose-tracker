
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function getLocalDate() {
    const now = new Date();

    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-${String(
        now.getDate()
    ).padStart(2, "0")}`;
}

const initialForm = {
    reading_date: getLocalDate(),
    time_slot: "Morning",
    value: ""
};

function Readings() {
    const navigate = useNavigate();

    const [readings, setReadings] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch readings
    const fetchReadings = async () => {
        try {
            const response = await api.get("/readings");
            setReadings(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to fetch readings."
            );
        }
    };

    useEffect(() => {
        fetchReadings();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Reset form
    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
    };

    // Add or update reading
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const payload = {
                ...form,
                value: Number(form.value)
            };

            if (editingId) {
                await api.put(`/readings/${editingId}`, payload);
                setSuccess("Reading updated successfully!");
            } else {
                await api.post("/readings", payload);
                setSuccess("Reading added successfully!");
            }

            resetForm();
            await fetchReadings();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save reading."
            );
        } finally {
            setLoading(false);
        }
    };

    // Edit reading
    const handleEdit = (reading) => {
        setError("");
        setSuccess("");

        setEditingId(reading.id);

        setForm({
            reading_date: String(reading.reading_date).slice(0, 10),
            time_slot: reading.time_slot,
            value: String(reading.value)
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete reading
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this reading?"
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");

        try {
            await api.delete(`/readings/${id}`);

            setSuccess("Reading deleted successfully!");

            if (String(editingId) === String(id)) {
                resetForm();
            }

            await fetchReadings();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete reading."
            );
        }
    };

    return (
        <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>

            <button onClick={() => navigate("/dashboard")}>
                ← Back to Dashboard
            </button>

            <h1>My Readings</h1>
            <p>Manage your blood glucose readings here.</p>

            <section style={{
                padding: "20px",
                marginTop: "25px",
                border: "1px solid #ddd",
                borderRadius: "12px"
            }}>

                <h2>
                    {editingId ? "Edit Reading" : "Add New Reading"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Date</label>
                        <br />
                        <input
                            type="date"
                            name="reading_date"
                            value={form.reading_date}
                            max={getLocalDate()}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Time Slot</label>
                        <br />
                        <select
                            name="time_slot"
                            value={form.time_slot}
                            onChange={handleChange}
                            required
                        >
                            <option value="Morning">Morning</option>
                            <option value="After breakfast">
                                After breakfast
                            </option>
                            <option value="After lunch">
                                After lunch
                            </option>
                            <option value="After dinner">
                                After dinner
                            </option>
                        </select>
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Glucose Value (mg/dL)</label>
                        <br />
                        <input
                            type="number"
                            name="value"
                            min="40"
                            max="600"
                            step="1"
                            placeholder="Enter glucose value"
                            value={form.value}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && (
                        <p style={{ color: "red" }}>{error}</p>
                    )}

                    {success && (
                        <p style={{ color: "green" }}>{success}</p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Saving..."
                            : editingId
                                ? "Update Reading"
                                : "Save Reading"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{ marginLeft: "10px" }}
                        >
                            Cancel
                        </button>
                    )}

                </form>
            </section>

            <section style={{ marginTop: "30px" }}>

                <h2>All Readings ({readings.length})</h2>

                {readings.length === 0 ? (
                    <p>No readings recorded yet. Add your first reading!</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table
                            width="100%"
                            cellPadding="12"
                            style={{
                                borderCollapse: "collapse",
                                textAlign: "left"
                            }}
                        >
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time Slot</th>
                                    <th>Glucose Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {readings.map((reading) => (
                                    <tr key={reading.id}>
                                        <td>
                                            {new Date(
                                                reading.reading_date
                                            ).toLocaleDateString("en-IN")}
                                        </td>

                                        <td>{reading.time_slot}</td>

                                        <td>
                                            <strong>
                                                {reading.value} mg/dL
                                            </strong>
                                        </td>

                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleEdit(reading)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(reading.id)
                                                }
                                                style={{ marginLeft: "8px" }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </section>

        </div>
    );
}

export default Readings;
