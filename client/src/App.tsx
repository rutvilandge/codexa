import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import WorkspacePage from "./pages/WorkspacePage";
import CommandPalette from "./components/workspace/CommandPalette";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuthStore } from "./store/authStore";

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    const runProject = (event: KeyboardEvent) => {
      if (event.key === "F5") { event.preventDefault(); window.dispatchEvent(new Event("codexa:run")); }
    };
    window.addEventListener("keydown", runProject);
    return () => window.removeEventListener("keydown", runProject);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/workspace/:projectId" element={<WorkspacePage />} />
        </Route>
      </Routes>

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette />
    </>
  );
}

export default App;
