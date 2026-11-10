import Readings from "./pages/Readings";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Default page */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* Login page */}
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route path="/reports" element={<Reports />} />

                {/* Dashboard page */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
    path="/readings"
    element={<Readings />}
/>

                {/* Unknown URLs */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

                <Route path="/register" element={<Register />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
