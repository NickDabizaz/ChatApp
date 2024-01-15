import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import React from "react";
import { useNavigate } from "react-router-dom";

const ContainerStyle = {
  // backgroundColor: "#1286CE",
  pt: 35,
  pb: 35,
};

const GridStyle = {
  backgroundColor: "#1286CE",
};

const ButtonStyle = {
  marginLeft: "6vw",
  marginTop: "1.5vh",
  color:"black",
  backgroundColor: "#1EE1BF",
  borderColor: "#1EE1BF",
  width: "8vw",
  fontWeight: 700
};

function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <Container maxWidth="xl" sx={ContainerStyle}>
        <Grid container justifyContent="center" margin={0}>
        <div className="rounded shadow-xl" style={{backgroundColor: "#1286CE", width: "20vw", height: "20vh"}}>
          <div style={{textAlign: "center", marginTop: "3vh", color:"white", fontWeight: 700}}>Welcome to ChatApp!</div>
          <div style={{textAlign: "center", color:"white", fontWeight: 700}}>a duplicate of WhatsApp</div>
          <Button sx={ButtonStyle} onClick={() => navigate("/login")}>Login</Button>
        </div>
        </Grid>
      </Container>
    </>
  );
}

export default LandingPage;
