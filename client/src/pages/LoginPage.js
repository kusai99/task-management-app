// src/pages/LoginPage.js
import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "../axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function LoginPage({ setToken }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate
  console.log("LoginPage.js: setToken prop received?", !!setToken);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", formData);
      setToken(response.data.token); // Store token
      navigate("/tasks"); // Redirect to tasks page
    } catch (err) {
      setError("Login failed" + err);
    }
  };
  const handleGoToRegistration = () => {
    navigate("/register"); // Navigate to registration page
  };
  return (
    <Container maxWidth="xs">
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: "center", marginTop: "80px" }}
      >
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="username"
          label="Username"
          fullWidth
          required
          value={formData.username}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          required
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <Button
        onClick={handleGoToRegistration}
        variant="text"
        fullWidth
        color="secondary"
        style={{ marginTop: "10px" }}
      >
        Don't have an account? Register here
      </Button>
    </Container>
  );
}

export default LoginPage;
