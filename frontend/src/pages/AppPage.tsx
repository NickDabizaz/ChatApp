import React, { Suspense, useEffect, useState, useRef } from "react";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import axios from "axios";
import { useCookies } from "react-cookie";
import ProfilePage from "./ProfilePage";
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
  const [selectedBackground, setSelectedBackground] = useState(0);

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  const customBackgrounds = [
    "#FFFFFF", // Putih
    "#FF5733", // Oranye Terang
    "#66BB6A", // Hijau Mint
    "#FF4081", // Merah Muda
    "#2196F3", // Biru Navy
    "#FFD54F", // Kuning Lemon
    "#121212", // Hitam Gelap
    "#1E1E1E", // Hitam Gelap (Paper)
    "#FFC107", // Kuning
    "#333333", // Abu-abu Tua (Text)
    "#9C27B0", // Ungu Lavender
    "#FF5722", // Oranye
    "#333333", // Abu-abu Tua
    "#2196F3", // Biru Langit
    "#FF5733", // Cokelat Tua
    "#9C27B0", // Ungu Royal
  ];

  const lightModePalette = {
    mode: "light",
    primary: {
      main: "#1EA1E1",
    },
    secondary: {
      main: "#1EE1BF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#E6E6E6",
      ...customBackgrounds,
    },
    text: {
      primary: "#333333",
    },
  };

  const darkModePalette = {
    mode: "dark",
    primary: {
      main: "#c084fc",
    },
    secondary: {
      main: "#C0FC84",
    },
    background: {
      default: "#302c2c",
      paper: "#4B4444",
      ...customBackgrounds,
    },
    text: {
      primary: "#FFFFFF",
    },
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
        console.log(response.data);

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

  useEffect(() => {
    console.log(selectedBackground);
  }, [selectedBackground]);

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
                  selectedBackground={selectedBackground}
                  setSelectedBackground={setSelectedBackground}
                  customBackgrounds={customBackgrounds}
                />
              )
            )}
          </ContainerContentLeft>

          {/* ini bagian kanan */}
          <ContainerContentRight>
            {curFriend || curGroup ? (
              <ChatPage
                curUserId={cookie.user_id}
                userFriends={userFriends}
                curFriend={curFriend}
                setCurFriend={setCurFriend}
                curGroup={curGroup}
                setCurGroup={setCurGroup}
                selectedBackground={selectedBackground}
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
