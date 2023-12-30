import React from "react";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

const Container = styled(Box)({
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
});

const PaperContainer = styled(Paper)({
  padding: "1rem",
  textAlign: "center",
});

function WelcomePage() {
  return (
    <>
      <Container>
        <PaperContainer elevation={10}>
          <Typography variant="h6" gutterBottom>
            Welcome to the Chat App!
          </Typography>
        </PaperContainer>
      </Container>
    </>
  );
}

export default WelcomePage;
