import React, { Suspense, useEffect, useState, useRef } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { style, styled } from "@mui/system";
import ContactCard from "../components/ContactCard";
import axios from "axios";
import { useCookies } from "react-cookie";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiIcon from "@mui/icons-material/EmojiEmotions";
import EditProfilePage from "./ProfilePage";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Popper from "@mui/material/Popper";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { io } from "socket.io-client";

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

const AvatarImage = styled(Avatar)({
  width: "4rem",
  height: "4rem",
});

const FlexContainer = styled(Box)({
  display: "flex",
  width: "100%",
});

const HomeContainer = styled(Box)({
  width: "100%",
  height: "100%",
  backgroundColor: "yellow",
  overflow: "auto",
});

const FriendListContainer = styled(Box)({
  width: "100%",
  height: "auto",
});

function HomePage(props) {
  const [userData, setUserData] = useState(null);
  const [curFriend, setCurFriend] = useState(null);
  const [chat, setChat] = useState(null);
  const [curUserprofpic, setCurUserprofpic] = useState();
  const [userFriends, setUserFriends] = useState(null);
  const socket = io("http://localhost:3000");
  const scrollRef = useRef();
  const curUserId = props.curUserId;
  console.log(curUserId);

  const fetchChat = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(
        `http://localhost:3000/api/users/chat-history/${curUserId}/${curFriend.friendId}`
      );
      setChat(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  useEffect(() => {
    // Listen for incoming chat messages
    socket.on("chat message", (msg) => {
      // alert(msg)
      fetchChat();
    });

    return () => {
      socket.disconnect();
    };
  }, [chat]);

  useEffect(() => {
    console.log("scroll");
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
    });
  }, [chat]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `http://localhost:3000/api/users/user-details/${curUserId}`
        );
        setUserData(response.data);
        setUserFriends(response.data.friends);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    const fetchUserProfpic = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `http://localhost:3000/api/users/pic/${curUserId}`
        );
        setCurUserprofpic(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user profpic", error);
      }
    };

    fetchUserProfpic();
    fetchUserData();
    console.log("bsia lohhh");
  }, [curUserId]);
  console.log(userData);

  return (
    <Container>
      {/* content kiri */}
      <LeftContainer>
        {userData ? (
          <HomeContainer>
            <FlexContainer>
              <AvatarImage
                alt="Profile picture"
                src={
                  curUserprofpic
                    ? `http://localhost:3000/api/users/pic/${curUserId}`
                    : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                }
              />
              {userData.name}
            </FlexContainer>
            <FriendListContainer>
              <Accordion sx={{ boxShadow: "none" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  Accordion 1
                </AccordionSummary>
                <AccordionDetails>
                  <ContactCard friends={userData.friends} />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Accordion 2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </FriendListContainer>
          </HomeContainer>
        ) : (
          "loading..."
        )}
      </LeftContainer>
    </Container>
  );
}

export default HomePage;
