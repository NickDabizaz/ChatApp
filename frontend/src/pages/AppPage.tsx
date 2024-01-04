import React, { Suspense, useEffect, useState, useRef } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { style, styled } from "@mui/system";
import ContactCard from "../components/homepage/ContactCard";
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
import ProfilePage from "./ProfilePage";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Popper from "@mui/material/Popper";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Navbar from "../components/Navbar";
import ChatListPage from "./ChatListPage";
import ChatPage from "./ChatPage";
import SettingPage from "./SettingPage";
import HomePage from "./HomePage";
import AddFriendPage from "./AddFriendPage";

const Container = styled(Box)({
  margin: "auto",
  display: "flex",
  width: "90vw",
  minWidth: "90vw",
  height: "90vh",
  minHeight: "90vh",
  backgroundColor: "lightgray",
});

const ContainerNavbar = styled(Box)({
  flex: 1,
});

const ContainerContentLeft = styled(Box)({
  flex: 20,
});

const ContainerContentRight = styled(Box)({
  flex: 40,
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

function AppPage() {
  const [route, setRoute] = useState("home");

  const [cookie, setCookie, removeCookie] = useCookies("user_id");
  const [userData, setUserData] = useState(null);
  const [userProfpic, setUserProfpic] = useState(null);
  const [userFriends, setUserFriends] = useState(null);
  const [curFriend, setCurFriend] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `http://localhost:3000/api/users/user-details/${cookie.user_id}`
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
          `http://localhost:3000/api/users/pic/${cookie.user_id}`
        );
        setUserProfpic(response.data);
      } catch (error) {
        console.error("Error fetching user profpic", error);
      }
    };

    fetchUserProfpic();
    fetchUserData();
  }, [cookie.user_id]);

  return (
    <>
      <Container>
        {/* ini navbar dikiri */}
        <ContainerNavbar>
          <Navbar setRoute={setRoute} />
        </ContainerNavbar>

        {/* ini konten yang kiri */}
        <ContainerContentLeft>
          {/* ini nampilin konten sesuai route */}

          {route === "home" ? (
            //ini kalo routenya home
            <HomePage
              curUserId={cookie.user_id}
              setCurFriend={setCurFriend}
              userData={userData}
              userProfpic={userProfpic}
            />
          ) : route === "chat" ? (
            //ini kalo routenya chat
            <ChatListPage
              userFriends={userFriends}
              setCurFriend={setCurFriend}
            />
          ) : route === "addfriend" ? (
            //ini kalo routenya addfriend
            <AddFriendPage
              userFriends={userFriends}
              curUserId={cookie.user_id}
            />
          ) : route === "profile" ? (
            //ini kalo routenya profile
            <ProfilePage
              curUserId={cookie.user_id}
              userData={userData}
              userProfpic={userProfpic}
            />
          ) : (
            //ini kalo routenya setting
            <SettingPage />
          )}
        </ContainerContentLeft>
        <ContainerContentRight>
          {curFriend ? (
            <ChatPage
              curFriend={curFriend}
              setCurFriend={setCurFriend}
              curUserId={cookie.user_id}
            />
          ) : (
            <PaperContainer>
              <Typography variant="h6">Start a Conversation!</Typography>
            </PaperContainer>
          )}
        </ContainerContentRight>
      </Container>
    </>
  );
}

export default AppPage;
