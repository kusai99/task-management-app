// src/pages/RegistrationPage.js
import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "../axios"; // Import axios instance
import { useNavigate } from "react-router-dom"; // Import useNavigate

function RegistrationPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/register", formData);
      console.log(response.data);
      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err) {
      setError("Registration failed: " + err.message);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login"); // Navigate to registration page
  };

  return (
    <Container maxWidth="xs">
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: "center", marginTop: "80px" }}
      >
        Register
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
          name="email"
          label="Email"
          type="email"
          fullWidth
          required
          value={formData.email}
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
          Register
        </Button>
      </form>
      <Button
        onClick={handleGoToLogin}
        variant="text"
        fullWidth
        color="secondary"
        style={{ marginTop: "10px" }}
      >
        Already have an account? Login here
      </Button>
    </Container>
  );
}

export default RegistrationPage;
