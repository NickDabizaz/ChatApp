import React, { Suspense, useEffect, useState } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { style, styled } from "@mui/system";
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
  height: "90vh",
  // justifyContent: "center",
  // alignItems: "center",
});

const Sidebar = styled(Box)({
  width: "20rem",
  backgroundColor: "#f0f0f0",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const ProfileContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop: "1rem",
});

const Line = styled("hr")({
  width: "100%",
  border: "1px solid #ccc",
  margin: "1rem 0",
});

// const ContactCard = styled(Paper)({
//   width: "80%",
//   padding: "1rem",
//   marginBottom: "1rem",
// });

const NameContainer = styled(Box)({
  display: "block",
});

const ContentContainer = styled(Box)({
  width: "60rem",
  display: "flex",
  // justifyContent: "center",
  // alignItems: "center",
});

const AvatarImage = styled(Avatar)({
  width: "4rem",
  height: "4rem",
});

const PaperContainer = styled(Paper)({
  padding: "1rem",
  width: "100%",
  height: "fit-content",
  margin: "auto",
  textAlign: "center",
  borderRadius: "0",
  boxShadow: "none",
});

const ChatContainer = styled(Paper)({
  backgroundColor: "yellow",
  width: "100%",
  borderRadius: "0",
  boxShadow: "none",
});

const FriendDetailContainer = styled(Box)({
  padding: "1rem",
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  backgroundColor: "red",
  fontSize: "1.2rem",
});

const ChatMessageContainer = styled(Box)({
  height: "auto",
  backgroundColor: "yellow",
});

const UserInputField = styled(Box)({
  height: "10rem",
  backgroundColor: "red",
});

function HomePage() {
  const [userData, setUserData] = useState(null);
  const [cookie, setCookie] = useCookies("user_id");
  const [loading, setLoading] = useState(true);
  const [curFriend, setCurFriend] = useState(null);

  useEffect(() => {
    setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    console.log(curFriend);
  });

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
          <NameContainer>
            <Typography variant="h6" gutterBottom>
              {userData.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {/* {userData.status} */}online
            </Typography>
          </NameContainer>
        </ProfileContainer>
        <Line />

        <Suspense fallback={<div>Loading...</div>}>
          <ContactCard friends={userData.friends} setCurFriend={setCurFriend} />
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
        {/* <Outlet /> */}
        {curFriend ? (
          <ChatContainer>
            <button onClick={() => setCurFriend(null)}>↩️ Back</button>

            {/* gambar teman, nama dan status */}
            <FriendDetailContainer>
              {curFriend ? (
                <>
                  <AvatarImage
                    alt="Friend Avatar"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE1gis2dLLKJ_dBWVyf4j1fJ3tDvKzO2g7yQ&usqp=CAU"
                  />
                  <Paper style={{ textAlign: "left" }}>
                    {curFriend.name} <br />
                    🟢online
                  </Paper>
                </>
              ) : (
                "loading"
              )}
            </FriendDetailContainer>

            {/* tempat message nya */}
            <ChatMessageContainer></ChatMessageContainer>

            {/* input */}
            <UserInputField></UserInputField>
          </ChatContainer>
        ) : (
          <PaperContainer>
            <Typography variant="h6">Start a Conversation!</Typography>
          </PaperContainer>
        )}
      </ContentContainer>
    </Container>
  );
}

export default HomePage;
