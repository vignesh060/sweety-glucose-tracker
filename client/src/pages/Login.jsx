
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import "./Auth.css";

function Login() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
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
        setLoading(true);

        try {
            const response = await api.post("/auth/login", form);

            const token = response.data.token;

            if (!token) {
                throw new Error("Login response did not contain a token.");
            }

            localStorage.setItem("token", token);
            navigate("/dashboard");

        } catch (err) {
            setError(
                err.response?.data?.message || err.message || "Login failed."
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

                <h1>Welcome Back</h1>
                <p className="auth-subtitle">
                    Sign in to your Sweety Glucose Tracker
                </p>

                <form onSubmit={handleSubmit}>

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
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")}>
                        Create Account
                    </span>
                </p>

            </div>
        </div>
    );
}

export default Login;
