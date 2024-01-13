import React, { Suspense, useEffect, useState, useRef } from "react";
import Box from "@mui/system/Box";
import { styled, useTheme } from "@mui/system"; // Tambahkan useTheme
import ChatCard from "../components/chatlistpage/ChatCard";
import {
  Avatar,
  Button,
  IconButton,
  Popover,
  Popper,
  TextField,
} from "@mui/material";
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

const ContainerMember = styled(Box)(({ theme }) => ({
  height: "50px",
  width: "100%",
  border: "1px solid black",
  backgroundColor: theme.palette.primary.main,
}));

const MemberImage = styled(Avatar)(({ theme }) => ({
  height: "40px",
  width: "40px",
}));

function ChatListPage(props) {
  const [search, setSearch] = useState("");
  const [filteredChats, setFilteredChats] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const curUserId = props.curUserId;
  const userFriends = props.userFriends;
  const userGroups = props.userGroups;

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleClickPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

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
  console.log(userFriends);

  return (
    <>
      <Container>
        <FlexContainer>
          Chats
          <NewChatContainer>
            <IconButton onClick={handleClickPopper}>
              <AddCommentIcon />
            </IconButton>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center", // Sesuaikan agar Popover tepat berada di bawah FriendDetailContainer
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center", // Sesuaikan agar Popover tepat berada di bawah FriendDetailContainer
              }}
            >
              <Box
                sx={{
                  border: 1,
                  p: 1,
                  bgcolor: theme.palette.background.default,
                  width: "20vw",
                }}
              >
                <Box sx={{ textAlign: "center", fontSize: "1.4rem" }}>
                  New Chat
                </Box>
                <Box>
                  {userFriends.map((friend, index) => (
                    <ContainerMember
                      key={index}
                      onClick={() => {
                        props.setCurFriend(friend);
                        props.setCurGroup(null);
                        setAnchorEl(null);
                      }}
                      style={{
                        pointerEvents: `${
                          friend.userId === curUserId ? "none" : "auto"
                        }`,
                        cursor: "pointer",
                      }}
                    >
                      <FlexContainer>
                        <MemberImage alt="Member Profile Picture" />
                        <Box>{friend.name}</Box>
                        {friend.role === "admin" && (
                          <Box sx={{ marginLeft: "auto" }}>admin</Box>
                        )}
                      </FlexContainer>
                    </ContainerMember>
                  ))}
                </Box>
              </Box>
            </Popover>
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
