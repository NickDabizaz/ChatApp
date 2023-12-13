import React from "react";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { useLoaderData } from "react-router";

interface ProfileData {
  name: string;
  status: string;
  // Add other properties as needed
}

const Container = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
});

const PaperContainer = styled(Paper)({
  padding: "1rem",
  textAlign: "center",
});

const AvatarImage = styled(Avatar)({
  width: "10rem",
  height: "10rem",
  margin: "auto",
});

function LoginPage() {
  const userData: ProfileData = useLoaderData();

  console.log(userData);
  return (
    <>
      <Container>
        <PaperContainer elevation={10}>
          <AvatarImage
            alt="User Avatar"
            src="https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
          />
          <Typography variant="h5" gutterBottom>
            John Doe{" "}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            awikwok{" "}
          </Typography>
        </PaperContainer>
      </Container>
    </>
  );
}

export default LoginPage;
