import React, { Suspense, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import ContactCard from "../components/ContactCard";
import axios from "axios";
import { useCookies } from "react-cookie";

interface ProfileData {
  name: string;
  status: string;
  // Add other properties as needed
}

const Container = styled(Box)({
  display: "flex",
  height: "100vh",
});

const Sidebar = styled(Box)({
  flex: 1,
  backgroundColor: "#f0f0f0",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const ProfileContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "1rem",
});

const Line = styled("hr")({
  width: "80%",
  border: "1px solid #ccc",
  margin: "1rem 0",
});

// const ContactCard = styled(Paper)({
//   width: "80%",
//   padding: "1rem",
//   marginBottom: "1rem",
// });

const ContentContainer = styled(Box)({
  flex: 3,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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

function HomePage() {
  const [userData, setUserData] = useState(null);
  const [cookie, setCookie] = useCookies("user_id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `http://localhost:3000/api/users/user-details/${cookie.user_id}`
        );
        setUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    // You can show a loading indicator while data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <Container>
      {/* sidebar kiri */}
      <Sidebar>
        <ProfileContainer>
          <AvatarImage
            alt="User Avatar"
            src="https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
          />
          <Typography variant="h6" gutterBottom>
            {userData.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {/* {userData.status} */}online
          </Typography>
        </ProfileContainer>
        <Line />

        <Suspense fallback={<div>Loading...</div>}>
          <ContactCard friends={userData.friends} />
        </Suspense>
        {/* <ContactCard elevation={3}>
          <Typography variant="h6">Contact Name</Typography>
          <Typography variant="body2" color="textSecondary">
            contact@example.com
          </Typography>
        </ContactCard> */}
      </Sidebar>

      {/* content kanan */}
      <ContentContainer>
        <PaperContainer elevation={10}>
          <Typography variant="h6" gutterBottom>
            Welcome to the Chat App!
          </Typography>
        </PaperContainer>
      </ContentContainer>
    </Container>
  );
}

export default HomePage;
