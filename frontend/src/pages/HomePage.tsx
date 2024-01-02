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
import { Button, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiIcon from "@mui/icons-material/EmojiEmotions";
import EditProfilePage from "./ProfilePage";

interface ProfileData {
  name: string;
  status: string;
  // Add other properties as needed
}

const Container = styled(Box)({
  display: "flex",
  height: "90vh",
  maxHeight: "90vh",
  // justifyContent: "center",
  // alignItems: "center",
});

const LeftContainer = styled(Box)({
  minWidth: "20rem",
  height: "100%",
  backgroundColor: "blue",
});

const Sidebar = styled(Box)({
  height: "100%",
  width: "20rem",
  minWidth: "20rem",
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
  maxHeight: "100%",
  overflow: "auto",
});

const FriendDetailContainer = styled(Box)({
  // padding: "1rem",
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  backgroundColor: "gray",
  fontSize: "1.2rem",
  height: "15%",
});

const ChatMessageContainer = styled(Box)({
  height: "auto",
  backgroundColor: "yellow",
  height: "70%",
  overflow: "auto",
});

const UserInputField = styled(Box)({
  height: "15%",
  backgroundColor: "gray",
  display: "flex",
  alignItems: "center",
  paddingLeft: "1rem",
  paddingRight: "1rem",
});

function HomePage(props) {
  const [userData, setUserData] = useState(null);
  const [cookie, setCookie] = useCookies("user_id");
  const [loading, setLoading] = useState(true);
  const [curFriend, setCurFriend] = useState(null);
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [profpic, setProfPic] = useState();
  const [curFriendprofpic, setCurFriendprofpic] = useState();
  const [search, setSearch] = useState("");
  const route = props.route;
  console.log(route);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/users/pic/${cookie.user_id}`)
      .then((res) => {
        setProfPic(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [profpic]);

  const fetchChat = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(
        `http://localhost:3000/api/users/chat-history/${cookie.user_id}/${curFriend.friendId}`
      );
      setChat(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const handleSendMessage = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        "http://localhost:3000/api/users/send-message",
        {
          userId: cookie.user_id,
          friendId: curFriend.friendId,
          content: newMessage,
        }
      );

      // Update the chat after sending the message
      fetchChat();
      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

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
  }, [cookie.user_id]);

  useEffect(() => {
    setChat(null);

    if (curFriend) {
      axios
        .get(`http://localhost:3000/api/users/pic/${curFriend.friendId}`)
        .then((res) => {
          setCurFriendprofpic(res.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      fetchChat();
    }
  }, [curFriend]);

  return (
    <Container>
      {/* content kiri */}
      <LeftContainer>
        {userData ? (
          route === "home" ? (
            <Sidebar>
              <TextField
                label="Search"
                variant="outlined"
                margin="normal"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Suspense fallback={<div>Loading...</div>}>
                <ContactCard
                  friends={userData.friends}
                  setCurFriend={setCurFriend}
                />
              </Suspense>
            </Sidebar>
          ) : route === "profile" ? (
            <EditProfilePage />
          ) : (
            "asd"
          )
        ) : (
          "loading..."
        )}
      </LeftContainer>
      {/* content kanan */}
      <ContentContainer>
        {/* <Outlet /> */}
        {curFriend ? (
          <ChatContainer>
            {/* gambar teman, nama dan status */}
            <FriendDetailContainer>
              <div onClick={() => setCurFriend(null)}>↩️</div>
              {curFriend ? (
                <>
                  <AvatarImage
                    alt="Friend Avatar"
                    src={
                      curFriendprofpic
                        ? `http://localhost:3000/api/users/pic/${curFriend.friendId}`
                        : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                    }
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
            <ChatMessageContainer>
              {chat
                ? chat.map((message) => (
                    <div
                      style={{
                        padding: "1rem",
                        border: "1px solid black",
                        width: "fit-content",
                        margin: "1rem",
                        float: `${
                          message.senderId === cookie.user_id ? "right" : "left"
                        }`,
                        borderRadius: `${
                          message.senderId === cookie.user_id
                            ? "10px 10px 0px 10px"
                            : "10px 10px 10px 0px"
                        }`,
                        clear: "both",
                      }}
                    >
                      {message.content}
                    </div>
                  ))
                : "loading..."}
            </ChatMessageContainer>

            {/* input */}
            <UserInputField>
              <IconButton aria-label="emoji" color="secondary">
                <EmojiIcon />
              </IconButton>
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1, padding: "0.5rem", marginRight: "0.5rem" }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </UserInputField>
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
