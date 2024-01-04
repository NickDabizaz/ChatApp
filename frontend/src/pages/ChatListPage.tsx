import React, { Suspense, useEffect, useState, useRef } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { style, styled } from "@mui/system";
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

const Container = styled(Box)({
  height: "100%",
  //   width: "20rem",
  //   minWidth: "20rem",
  backgroundColor: "#f0f0f0",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
});

const FlexContainer = styled(Box)({
  display: "flex",
  width: "100%",
});

const NewChatContainer = styled(Box)({
  flex: "auto",
  textAlign: "end",
});

function ChatListPage(props) {
  const [search, setSearch] = useState("");
  const [filteredFriends, setFilteredFriends] = useState(null);

  const userFriends = props.userFriends;

  const handlingSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (userFriends) {
      // Filter userFriends based on the search term
      const filteredData = userFriends.filter((friend) =>
        friend.name.toLowerCase().includes(searchTerm)
      );

      // Update the state with the filtered data
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
