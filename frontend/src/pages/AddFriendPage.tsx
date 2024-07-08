import React, { useEffect, useState } from "react";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import GroupIcon from "@mui/icons-material/Group";
import { margin, styled, useTheme } from "@mui/system";
import axios from "axios";

const Container = styled(Box)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.background.default,
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  color: theme.palette.text.primary,
}));

const FlexContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  color: theme.palette.text.primary,
}));

const Card = styled(Box)(({ theme }) => ({
  width: "100%",
  border: `1px solid ${theme.palette.divider}`,
  padding: "1rem",
  marginBottom: "1rem",
}));

function AddFriendPage(props) {
  const [add, setAdd] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchResultProfpic, setSearchResultProfpic] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const curUserId = props.curUserId;
  const userFriendRequests = props.userFriendRequests;

  const theme = useTheme();

  const handleSearchTextChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    let temp = props.userFriends.filter(
      (friend) => friend.phoneNumber === search && friend.status === "accepted"
    );

    if (temp.length > 0) {
      setSearchResult(null);
    } else {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/user-details-by-phone/${search}`
        );
        setSearchResult(response.data);
        setSearchLoading(false);
      } catch (error) {
        console.error("Error fetching user data", error);
        setSearchResult(null);
      }
    }
  };

  const handleAcceptFriend = async (friendId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/accept-friend-request",
        {
          userId: curUserId,
          friendId: friendId,
        }
      );
      setSearch("");
      setSearchResult(null);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleAddFriend = async () => {
    let temp = userFriendRequests.filter((user) => user.phoneNumber === search);
    console.log(curUserId);
    // console.log(temp[0].friendId);

    if (temp.length > 0) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/users/accept-friend-request",
          {
            userId: curUserId,
            friendId: temp[0].friendId,
          }
        );
        setSearch("");
        setSearchResult(null);
      } catch (error) {
        console.error("Error adding friend:", error);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/users/add-friend",
          {
            userId: curUserId,
            friendPhoneNumber: search,
          }
        );
      } catch (error) {
        console.error("Error adding friend:", error);
      }
    }
  };

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/group-chats/create",
        {
          name: groupName,
          admin: curUserId,
        }
      );
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  useEffect(() => {
    if (search && searchResult) {
      const fetchUserProfpic = async () => {
        try {
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

  console.log(userFriendRequests);

  return (
    <Container>
      {/* tombol friend request */}
      <FlexContainer onClick={() => setAdd("request")}>
        <Card>
          <FlexContainer>
            <PersonAddIcon />
            Friend Request
            <Box sx={{ marginLeft: "auto", opacity: "50%" }}>
              {userFriendRequests.length > 0 && "🔴"}
            </Box>
          </FlexContainer>
        </Card>
      </FlexContainer>

      {/* tombol friend search */}
      <FlexContainer onClick={() => setAdd("friend")}>
        <Card>
          <PersonSearchIcon />
          Friend Search
        </Card>
      </FlexContainer>

      {/* tombol create group */}
      <FlexContainer onClick={() => setAdd("group")}>
        <Card>
          <GroupIcon />
          Create a Group
        </Card>
      </FlexContainer>

      <br />
      <br />

      {add === "request" ? (
        <>
          <Typography>Friend Request</Typography>

          {userFriendRequests &&
            userFriendRequests.map((friend, index) => (
              <FlexContainer
                key={index}
                p={2}
                sx={{ border: "1px solid black" }}
              >
                <Avatar
                  alt="Friend Search Avatar"
                  src={
                    searchResultProfpic
                      ? `http://localhost:3000/api/users/pic/${searchResult.userId}`
                      : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                  }
                />

                <Box>{friend.name}</Box>

                <Button
                  onClick={() => handleAcceptFriend(friend.friendId)}
                  sx={{ marginLeft: "auto" }}
                >
                  <PersonAddIcon />
                </Button>
              </FlexContainer>
            ))}
        </>
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
              <FlexContainer p={2} sx={{ border: "1px solid black" }}>
                <Avatar
                  alt="Friend Search Avatar"
                  src={
                    searchResultProfpic
                      ? `http://localhost:3000/api/users/pic/${searchResult.userId}`
                      : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                  }
                />
                {searchResult.name}
                <Button onClick={handleAddFriend} sx={{ marginLeft: "auto" }}>
                  <PersonAddIcon />
                </Button>
              </FlexContainer>
            )
          ) : (
            "No User Found"
          )}
        </>
      ) : (
        add === "group" && (
          <>
            <Typography>Create Group</Typography>

            <TextField
              label="Group Name"
              variant="outlined"
              margin="normal"
              fullWidth
              value={groupName}
              onChange={handleGroupNameChange}
              InputProps={{
                style: {
                  color: theme.palette.text.primary, // Sesuaikan dengan properti yang diinginkan
                },
              }}
            />

            <Button onClick={handleCreateGroup}>Create Group</Button>
          </>
        )
      )}
    </Container>
  );
}

export default AddFriendPage;
