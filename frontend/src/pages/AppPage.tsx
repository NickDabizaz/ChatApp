import React, { Suspense, useEffect, useState, useRef } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { style, styled } from "@mui/system";
import ContactCard from "../components/homepage/ContactCardFriend";
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
import { ThemeProvider, createTheme } from "@mui/material/styles";

const Container = styled(Box)({
  margin: "auto",
  display: "flex",
  width: "90vw",
  minWidth: "90vw",
  height: "90vh",
  minHeight: "90vh",
  marginTop: "5vh",
  border: "1px solid black",
});

const ContainerNavbar = styled(Box)({
  flex: 1,
});

const ContainerContentLeft = styled(Box)({
  flex: 6,
  border: "1px solid black",
  borderTop: "none",
  borderBottom: "none",
});

const ContainerContentRight = styled(Box)({
  flex: 12,
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
  const [userGroups, setUserGroups] = useState(null);
  const [curGroup, setCurGroup] = useState(null);
  const [userFriendRequests, setUserFriendRequests] = useState(null);
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  const lightModePalette = {
    mode: "light",
    primary: {
      main: "#2196F3", // Biru
    },
    secondary: {
      main: "#FFC107", // Kuning
    },
    background: {
      default: "#FFFFFF", // Putih
    },
    text: {
      primary: "#333333", // Abu-abu tua
    },
    // ... (Tambahkan palet warna lainnya sesuai kebutuhan)
  };

  const darkModePalette = {
    mode: "dark",
    primary: {
      main: "#9C27B0", // Ungu
    },
    secondary: {
      main: "#FF5722", // Oranye
    },
    background: {
      default: "#121212", // Hitam (latar belakang utama)
      paper: "#1E1E1E", // Hitam gelap (misalnya untuk kertas atau elemen lainnya)
    },
    text: {
      primary: "#FFFFFF", // Putih
    },
    // ... (Tambahkan palet warna lainnya sesuai kebutuhan)
  };

  const currentTheme = createTheme({
    palette: isDarkMode ? darkModePalette : lightModePalette,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `http://localhost:3000/api/users/user-details/${cookie.user_id}`
        );
        setUserData(response.data);
        setUserFriends(
          response.data.friends.filter((friend) => friend.status == "accepted")
        );
        setUserFriendRequests(
          response.data.friends.filter(
            (friend) => friend.status === "requested"
          )
        );
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

    const fetchUserGroup = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `http://localhost:3000/api/group-chats/userGroups/${cookie.user_id}`
        );
        setUserGroups(response.data);
      } catch (error) {
        console.error("Error fetching user profpic", error);
      }
    };

    fetchUserProfpic();
    fetchUserData();
    fetchUserGroup();
  }, [cookie.user_id]);

  useEffect(() => {
    console.log(userData);
    console.log(userGroups);
  }, [userData, userGroups]);

  return (
    <>
      <ThemeProvider theme={currentTheme}>
        <Container>
          {/* ini navbar dikiri */}
          <ContainerNavbar>
            <Navbar setRoute={setRoute} route={route} />
          </ContainerNavbar>

          {/* ini konten yang kiri */}
          <ContainerContentLeft>
            {/* ini nampilin konten sesuai route */}

            {route === "home" ? (
              //ini kalo routenya home
              cookie.user_id && userData && userFriends && userGroups ? (
                <HomePage
                  curUserId={cookie.user_id}
                  userData={userData}
                  userProfpic={userProfpic}
                  userFriends={userFriends}
                  setCurFriend={setCurFriend}
                  userGroups={userGroups}
                  setCurGroup={setCurGroup}
                />
              ) : (
                "loading..."
              )
            ) : route === "chat" ? (
              //ini kalo routenya chat
              userFriends && userGroups ? (
                <ChatListPage
                  curUserId={cookie.user_id}
                  userFriends={userFriends}
                  setCurFriend={setCurFriend}
                  userGroups={userGroups}
                  setCurGroup={setCurGroup}
                />
              ) : (
                "loading..."
              )
            ) : route === "addfriend" ? (
              //ini kalo routenya addfriend
              userFriends && cookie.user_id ? (
                <AddFriendPage
                  userFriends={userFriends}
                  curUserId={cookie.user_id}
                  userFriendRequests={userFriendRequests}
                />
              ) : (
                "loading..."
              )
            ) : route === "profile" ? (
              //ini kalo routenya profile
              cookie.user_id && userData ? (
                <ProfilePage
                  curUserId={cookie.user_id}
                  userData={userData}
                  setUserData={setUserData}
                  userProfpic={userProfpic}
                />
              ) : (
                "loading..."
              )
            ) : (
              route === "setting" && (
                //ini kalo routenya setting
                <SettingPage
                  removeCookie={removeCookie}
                  toggleDarkMode={toggleDarkMode}
                />
              )
            )}
          </ContainerContentLeft>

          {/* ini bagian kanan */}
          <ContainerContentRight>
            {curFriend || curGroup ? (
              <ChatPage
                curUserId={cookie.user_id}
                curFriend={curFriend}
                setCurFriend={setCurFriend}
                curGroup={curGroup}
                setCurGroup={setCurGroup}
              />
            ) : (
              <PaperContainer>
                <Typography variant="h6">Start a Conversation!</Typography>
              </PaperContainer>
            )}
          </ContainerContentRight>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default AppPage;
