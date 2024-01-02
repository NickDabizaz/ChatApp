import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styled from "@mui/system/styled";
import Swal from "sweetalert2";

const PaperContainer = styled(Paper)({
  padding: "1rem",
  textAlign: "center",
});

const ContainerStyle = {
  // backgroundColor: "#1286CE",
  pt: 20,
  pb: 20,
};

const PaperContainerStyle = {
  // backgroundColor: "#6CD4FF",
  backgroundColor: "#dddddd",
  overflow: "hidden",
};

const TextFieldStyle = {
  marginLeft: "auto",
  marginRight: "auto",
  width: "40rem",
};

const ButtonStyle = {
  // backgroundColor: "#C46E85",
  marginTop: "3rem",
  marginLeft: "auto",
  marginRight: "auto",
  fontWeight: 700,
  width: "40rem",
  color: "white",
};

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user_id"]);

  const onSubmit = async (data) => {
    if (data.phoneNumber === "1111111111" && data.password === "admin") {
      navigate("/admin");
      setCookie("user_id", -1);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        data
      );
      const responseData = response.data;
      console.log(responseData);

      setCookie("user_id", responseData.userId);
      navigate("/home");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number or Password",
        text: "The phone number or password you entered is incorrect.",
      });
    }
  };

  useEffect(() => {
    if (cookies.user_id) navigate("/home");
  }, [cookies.user_id, navigate]);

  return (
    <Container maxWidth="xl" sx={ContainerStyle}>
      <Grid container justifyContent="center" margin={0}>
        {/* <Paper elevation={10}> */}
        <Grid
          item
          xs={12}
          md={8}
          lg={6}
          component={PaperContainer}
          sx={PaperContainerStyle}
        >
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}></Grid>

            <Grid item xs={12}></Grid>

            <Grid item xs={12}></Grid>

            <Grid item xs={12}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  label="Phone number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  sx={TextFieldStyle}
                />
                {errors.email && (
                  <p style={{ color: "red", textAlign: "center" }}>
                    {errors.phoneNumber.message}
                  </p>
                )}
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  sx={TextFieldStyle}
                />
                {errors.password && (
                  <p style={{ color: "red", textAlign: "center" }}>
                    {errors.password.message}
                  </p>
                )}
                <Button type="submit" variant="contained" style={ButtonStyle}>
                  Login
                </Button>
              </form>
            </Grid>
            <Grid item xs={12}>
              <p style={{ textAlign: "center" }}>
                Don&#39;t Have Any Account?{" "}
                <Link to="/register">
                  <b style={{ color: "#D39C39" }}>Register Here</b>
                </Link>
              </p>
              {errorMessage && (
                <p
                  style={{
                    color: "red",
                    textAlign: "center",
                    marginTop: "1rem",
                  }}
                >
                  {errorMessage}
                </p>
              )}
            </Grid>
          </Grid>
        </Grid>
        {/* </Paper> */}
      </Grid>
    </Container>
  );
}

export default LoginPage;
