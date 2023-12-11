import React from "react";
import { useLoaderData } from "react-router-dom";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

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
  padding: (theme: any) => theme.spacing(2),
  textAlign: "center",
});

const AvatarImage = styled(Avatar)({
  width: 100,
  height: 100,
  margin: "auto",
});

function ProfileDashboard() {
  const userData: ProfileData = useLoaderData();

  console.log(userData);

  return (
    <Container>
      <PaperContainer elevation={3}>
        <AvatarImage alt="User Avatar" src="https://example.com/avatar.jpg" />
        <Typography variant="h5" gutterBottom>
          John Doe{" "}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          awikwok{" "}
        </Typography>
      </PaperContainer>
    </Container>
  );
}

export default ProfileDashboard;
