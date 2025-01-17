// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import TaskManagementPage from "./pages/TaskManagementPage";

function App() {
  const [token, setToken] = useState(null);
  console.log("App.js: setToken function exists?", !!setToken);
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route
          path="/tasks"
          element={token ? <TaskManagementPage token={token} /> : <LoginPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
