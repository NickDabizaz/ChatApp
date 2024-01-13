import React, { Suspense, useEffect, useState, useRef } from "react";
import Box from "@mui/system/Box";
import { styled, useTheme } from "@mui/system"; // Tambahkan useTheme
import ChatCard from "../components/chatlistpage/ChatCard";
import { Button, TextField } from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import axios from "axios";

// Tambahkan `theme` ke dalam properti styled
const Container = styled(Box)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.background.default,
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
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
  const [filteredChats, setFilteredChats] = useState(null);

  const curUserId = props.curUserId;
  const userFriends = props.userFriends;
  const userGroups = props.userGroups;

  const theme = useTheme(); // Gunakan hook useTheme untuk mendapatkan tema

  const handlingSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const tempFilter = [];

    if (userFriends) {
      const filteredData = userFriends.filter((friend) =>
        friend.name.toLowerCase().includes(searchTerm)
      );

      filteredData.map((data) => {
        tempFilter.push(data);
        tempFilter[tempFilter.length - 1].type = "friend";
      });
    }

    if (userGroups) {
      const filteredData = userGroups.groups.filter((group) =>
        group.name.toLowerCase().includes(searchTerm)
      );

      filteredData.map((data) => {
        tempFilter.push(data);
        tempFilter[tempFilter.length - 1].type = "group";
      });
    }

    setFilteredChats(tempFilter);
    console.log(tempFilter);

    setSearch(searchTerm);
  };

  useEffect(() => {
    handlingSearch({ target: { value: "" } });
  }, [props.curUserId, userFriends, userGroups.groups]);

  const displayChats = filteredChats;

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
          {displayChats &&
            displayChats.map((chat, index) => (
              <ChatCard
                key={index}
                chat={chat}
                curUserId={props.curUserId}
                setCurFriend={props.setCurFriend}
                setCurGroup={props.setCurGroup}
              />
            ))}
        </Suspense>
      </Container>
    </>
  );
}

export default ChatListPage;
