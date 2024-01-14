import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function RegisterPage() {
  const [userData, setUserData] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi konfirmasi kata sandi
    if (userData.password !== userData.confirmPassword) {
      Swal.fire("Error", "Konfirmasi kata sandi tidak sesuai!", "error");
      return;
    }

    try {
      // Kirim data pendaftaran ke backend
      const response = await axios.post("https://chat-app-api-qam0.onrender.com/api/users/register", {
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
      });

      // Tampilkan pesan sukses atau handle respons dari backend sesuai kebutuhan
      console.log("Registrasi Berhasil:", response.data);
      Swal.fire("Success", "Registrasi Berhasil!", "success");
    } catch (error) {
      // Tangani error, misalnya menampilkan pesan kesalahan atau melakukan sesuatu yang sesuai kebutuhan
      console.error("Error during registration:", error);

      // Tampilkan pesan kesalahan menggunakan SweetAlert
      if (error.response) {
        // Respon yang diterima dari server, namun bukan 2xx
        console.error("Server responded with:", error.response.data);
        Swal.fire("Gagal Register", `${error.response.data.error}`, "error");
      } else if (error.request) {
        // Permintaan dibuat tetapi tidak menerima respons
        console.error("No response received:", error.request);
        Swal.fire("Error", "No response received from the server", "error");
      } else {
        // Kesalahan lainnya
        console.error("Error details:", error.message);
        Swal.fire("Error", `Error details: ${error.message}`, "error");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone Number"
            type="text"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
        <Typography variant="body2" align="center" marginTop={2}>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default RegisterPage;
