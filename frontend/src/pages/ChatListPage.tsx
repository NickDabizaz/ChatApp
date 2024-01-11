import React, { Suspense, useEffect, useState, useRef } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { style, styled, useTheme } from "@mui/system"; // Tambahkan useTheme
import ChatCard from "../components/chatlistpage/ChatCard";
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

// Tambahkan `theme` ke dalam properti styled
const Container = styled(Box)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.background.default,
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
}));

const FlexContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  color: theme.palette.text.primary, // Sesuaikan dengan properti yang diinginkan
}));

const NewChatContainer = styled(Box)(({ theme }) => ({
  flex: "auto",
  textAlign: "end",
}));

function ChatListPage(props) {
  const [search, setSearch] = useState("");
  const [filteredFriends, setFilteredFriends] = useState(null);

  const userFriends = props.userFriends;
  const userGroups = props.userGroups;
  const theme = useTheme(); // Gunakan hook useTheme untuk mendapatkan tema

  const handlingSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (userFriends) {
      const filteredData = userFriends.filter((friend) =>
        friend.name.toLowerCase().includes(searchTerm)
      );

      setFilteredFriends(filteredData);
    }
    setSearch(searchTerm);
  };

  const displayFriends = filteredFriends || userFriends;

  return (
    <>
      <Container>
        <FlexContainer>
          Chats
          <NewChatContainer>
            <Button>
              <AddCommentIcon />
            </Button>
          </NewChatContainer>
        </FlexContainer>
        <TextField
          label="Search"
          variant="outlined"
          margin="normal"
          fullWidth
          value={search}
          onChange={handlingSearch}
          InputProps={{
            style: {
              color: theme.palette.text.primary, // Sesuaikan dengan properti yang diinginkan
            },
          }}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <ChatCard
            friends={displayFriends}
            setCurFriend={props.setCurFriend}
          />
        </Suspense>
      </Container>
    </>
  );
}

export default ChatListPage;
