
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Droplets,
    UserRound,
    Mail,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";

import api from "../services/api";
import "./Auth.css";

function Register() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await api.post("/auth/register", form);

            setSuccess("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Registration failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-logo">
                    <Droplets size={30} />
                </div>

                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Join Sweety Glucose Tracker
                </p>

                <form onSubmit={handleSubmit}>

                    <label>Full Name</label>

                    <div className="auth-input">
                        <UserRound size={18} />

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label>Email Address</label>

                    <div className="auth-input">
                        <Mail size={18} />

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label>Password</label>

                    <div className="auth-input">
                        <Lock size={18} />

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword
                                ? <EyeOff size={18} />
                                : <Eye size={18} />
                            }
                        </button>
                    </div>

                    {error && (
                        <p className="auth-error">{error}</p>
                    )}

                    {success && (
                        <p className="auth-success">{success}</p>
                    )}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <p className="auth-footer">
                    Already have an account?{" "}

                    <span onClick={() => navigate("/login")}>
                        Sign In
                    </span>
                </p>

            </div>
        </div>
    );
}

export default Register;
