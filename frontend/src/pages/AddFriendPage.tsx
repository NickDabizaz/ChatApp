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
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

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

const Card = styled(Box)({
  width: "100%",
  border: "1px solid black",
  padding: "1rem",
  marginBottom: "1rem",
});

function AddFriendPage(props) {
  const [add, setAdd] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchResultProfpic, setSearchResultProfpic] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const curUserId = props.curUserId;
  const userFriends = props.userFriends;

  const handleSearchTextChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = async () => {
    console.log(userFriends);

    let temp = userFriends.filter((friend) => friend.phoneNumber === search);
    console.log(temp);

    if (temp.length > 0) {
      console.log("udah temenan");
      setSearchResult(null);
    } else {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `http://localhost:3000/api/users/user-details-by-phone/${search}`
        );
        setSearchResult(response.data);
        setSearchLoading(true);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
        setSearchResult(null);
      }
    }
  };

  const handleAddFriend = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        "http://localhost:3000/api/users/add-friend",
        {
          userId: curUserId,
          friendPhoneNumber: search,
        }
      );

      console.log(response.data); // Log the response if needed
      // Handle success, show a message, update state, etc.
    } catch (error) {
      console.error("Error adding friend:", error);
      // Handle error, show an error message, etc.
    }
  };

  useEffect(() => {
    if (search && searchResult) {
      const fetchUserProfpic = async () => {
        try {
          // Replace with your actual API endpoint
          const response = await axios.get(
            `http://localhost:3000/api/users/pic/${searchResult.userId}`
          );
          setSearchResultProfpic(response.data);
          setSearchLoading(false);
        } catch (error) {
          console.error("Error fetching user profpic", error);
        }
      };

      fetchUserProfpic();
    }
  }, [searchResult]);

  return (
    <>
      <Container>
        <FlexContainer onClick={() => setAdd("request")}>
          <Card>
            <PersonAddIcon />
            Friend Request
          </Card>
        </FlexContainer>
        <FlexContainer onClick={() => setAdd("friend")}>
          <Card>
            <PersonSearchIcon />
            Friend Search
          </Card>
        </FlexContainer>
        <FlexContainer onClick={() => setAdd("group")}>
          <Card>
            <GroupIcon />
            Create a Group
          </Card>
        </FlexContainer>

        <br />
        <br />

        {add === "request" ? (
          <Typography>Friend Request</Typography>
        ) : add === "friend" ? (
          <>
            <Typography>Add friend</Typography>
            <TextField
              label="Phone Number"
              variant="outlined"
              margin="normal"
              fullWidth
              value={search}
              onChange={handleSearchTextChange}
            />
            <Button onClick={handleSearch}>Search</Button>
            {searchResult ? (
              searchLoading ? (
                "loading..."
              ) : (
                <FlexContainer>
                  <Avatar
                    alt="Friend Search Avatar"
                    src={
                      searchResultProfpic
                        ? `http://localhost:3000/api/users/pic/${searchResult.userId}`
                        : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                    }
                  />
                  {searchResult.name}
                  <Button onClick={handleAddFriend}>
                    <PersonAddIcon />
                  </Button>
                </FlexContainer>
              )
            ) : (
              "No User Found"
            )}
          </>
        ) : (
          <Typography>Create Group</Typography>
        )}
      </Container>
    </>
  );
}

export default AddFriendPage;
