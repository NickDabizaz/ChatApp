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

interface ProfileData {
  name: string;
  status: string;
  // Add other properties as needed
}

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

const Sidebar = styled(Box)({
  height: "100%",
  width: "20rem",
  minWidth: "20rem",
  backgroundColor: "#f0f0f0",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
});

const ProfileContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop: "1rem",
});

const Line = styled("hr")({
  width: "100%",
  border: "1px solid #ccc",
  margin: "1rem 0",
});

// const ContactCard = styled(Paper)({
//   width: "80%",
//   padding: "1rem",
//   marginBottom: "1rem",
// });

const NameContainer = styled(Box)({
  display: "block",
});

const ContentContainer = styled(Box)({
  width: "60rem",
  display: "flex",
  // justifyContent: "center",
  // alignItems: "center",
});

const AvatarImage = styled(Avatar)({
  width: "4rem",
  height: "4rem",
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

const ChatContainer = styled(Paper)({
  backgroundColor: "yellow",
  width: "100%",
  borderRadius: "0",
  boxShadow: "none",
  maxHeight: "100%",
  overflow: "auto",
});

const FriendDetailContainer = styled(Box)({
  // padding: "1rem",
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  backgroundColor: "gray",
  fontSize: "1.2rem",
  height: "15%",
});

const ChatMessageContainer = styled(Box)({
  height: "70%",
  backgroundColor: "silver",
  overflow: "auto",
});

const UserInputField = styled(Box)({
  height: "15%",
  backgroundColor: "gray",
  display: "flex",
  alignItems: "center",
  paddingLeft: "1rem",
  paddingRight: "1rem",
});

const FlexContainer = styled(Box)({
  display: "flex",
  width: "100%",
});

const NewChatContainer = styled(Box)({
  flex: "auto",
  textAlign: "end",
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
  const [cookie, setCookie] = useCookies("user_id");
  const [loading, setLoading] = useState(true);
  const [curFriend, setCurFriend] = useState(null);
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [profpic, setProfPic] = useState();
  const [curUserprofpic, setCurUserprofpic] = useState();
  const [curFriendprofpic, setCurFriendprofpic] = useState();
  const [search, setSearch] = useState("");
  const [userFriends, setUserFriends] = useState(null);
  const [filteredFriends, setFilteredFriends] = useState(null);
  const route = props.route;
  const [selectedFile, setSelectedFile] = useState(null);
  console.log(route);
  console.log({ curFriend });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClickPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  // chat image
  const [tempFile, setTempFile] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setTempFile(file);
    displayImage(file);
    console.log("masuk sini ");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    setTempFile(file);
    displayImage(file);
    console.log("masuk handle drop");
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    // Trigger the file input when the drop zone is clicked
    fileInputRef.current.click();
  };

  const displayImage = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Create an image element and set the data URL as its source
        const imgElement = document.createElement("img");
        imgElement.src = e.target.result;
        imgElement.alt = "Selected Image";

        imgElement.style.marginLeft = "auto";
        imgElement.style.marginRight = "auto";
        imgElement.style.height = "10rem";
        imgElement.style.width = "10rem";
        imgElement.style.objectFit = "cover";
        // imgElement.style.borderRadius = "50%";
        imgElement.style.border = "1px solid black";

        // Append the image element to the component
        document.getElementById("imageContainer").innerHTML = "";
        document.getElementById("imageContainer").appendChild(imgElement);
      };

      // Use readAsDataURL for images
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/users/pic/${cookie.user_id}`)
      .then((res) => {
        setProfPic(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [profpic]);

  const fetchChat = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(
        `http://localhost:3000/api/users/chat-history/${cookie.user_id}/${curFriend.friendId}`
      );
      setChat(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const handleSendMessage = async () => {
    try {
      // Replace with your actual API endpoint

      console.log(selectedFile);

      const response = await axios.post(
        "http://localhost:3000/api/users/send-message",
        {
          userId: cookie.user_id,
          friendId: curFriend.friendId,
          content: selectedFile ? selectedFile.name : newMessage,
        }
      );

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const result = await axios.post(
          `http://localhost:3000/api/users/chatImage/${cookie.user_id}/${curFriend.friendId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setAnchorEl(null);
      }

      // Update the chat after sending the message
      fetchChat();
      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  useEffect(() => {
    setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfpic = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `http://localhost:3000/api/users/pic/${cookie.user_id}`
        );
        setCurUserprofpic(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user profpic", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfpic();
    fetchUserData();
  }, [cookie.user_id]);

  useEffect(() => {
    setChat(null);

    if (curFriend) {
      axios
        .get(`http://localhost:3000/api/users/pic/${curFriend.friendId}`)
        .then((res) => {
          setCurFriendprofpic(res.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      fetchChat();
    }
  }, [curFriend]);

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
    <Container>
      {/* content kiri */}
      <LeftContainer>
        {userData ? (
          route === "home" ? (
            <HomeContainer>
              <FlexContainer>
                <AvatarImage
                  alt="Profile picture"
                  src={
                    curUserprofpic
                      ? `http://localhost:3000/api/users/pic/${cookie.user_id}`
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
          ) : route === "chat" ? (
            <Sidebar>
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
                <ContactCard
                  friends={displayFriends}
                  setCurFriend={setCurFriend}
                />
              </Suspense>
            </Sidebar>
          ) : route === "profile" ? (
            <EditProfilePage />
          ) : (
            "asd"
          )
        ) : (
          "loading..."
        )}
      </LeftContainer>
      {/* content kanan */}
      <ContentContainer>
        {/* <Outlet /> */}
        {curFriend ? (
          <ChatContainer>
            {/* gambar teman, nama dan status */}
            <FriendDetailContainer>
              <div onClick={() => setCurFriend(null)}>↩️</div>
              {curFriend ? (
                <>
                  <AvatarImage
                    alt="Friend Avatar"
                    src={
                      curFriendprofpic
                        ? `http://localhost:3000/api/users/pic/${curFriend.friendId}`
                        : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                    }
                  />
                  <Paper style={{ textAlign: "left" }}>
                    {curFriend.name} <br />
                    🟢online
                  </Paper>
                </>
              ) : (
                "loading"
              )}
            </FriendDetailContainer>

            {/* tempat message nya */}
            <ChatMessageContainer>
              {chat
                ? chat.map((message) => (
                    <div
                      style={{
                        padding: "1rem",
                        border: "1px solid black",
                        width: "fit-content",
                        margin: "1rem",
                        float: `${
                          message.senderId === cookie.user_id ? "right" : "left"
                        }`,
                        borderRadius: `${
                          message.senderId === cookie.user_id
                            ? "10px 10px 0px 10px"
                            : "10px 10px 10px 0px"
                        }`,
                        clear: "both",
                      }}
                    >
                      {message.content.includes("jpg") ? (
                        <img
                          alt="Image Chat"
                          src={`http://localhost:3000/api/users/messagePic/${message._id}`}
                          width={300}
                        />
                      ) : (
                        message.content
                      )}
                    </div>
                  ))
                : "loading..."}
            </ChatMessageContainer>

            {/* input */}
            <UserInputField>
              <IconButton aria-label="emoji" color="secondary">
                <EmojiIcon />
              </IconButton>
              <button
                aria-describedby={id}
                type="button"
                onClick={handleClickPopper}
              >
                <AddAPhotoIcon color="secondary" />
              </button>
              <Popper id={id} open={open} anchorEl={anchorEl} placement="top">
                <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
                  <div
                    className=" text-center"
                    style={{ display: "block", width: "100%" }}
                  >
                    {selectedFile ? (
                      <div id="imageContainer"></div>
                    ) : (
                      <img
                        alt="Image Chat"
                        src={
                          "https://i.pinimg.com/originals/41/7f/16/417f163906fc4d42f8e8af681894d05f.jpg"
                        }
                        width={200}
                      />
                    )}
                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      accept=".jpeg, .jpg, .png"
                    />
                    <div
                      onClick={handleClick}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      style={{
                        textAlign: "center",
                        cursor: "pointer",
                        height: "auto",
                      }}
                    >
                      <p>Select Image</p>
                    </div>
                  </div>
                </Box>
              </Popper>
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1, padding: "0.5rem", marginRight: "0.5rem" }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </UserInputField>
          </ChatContainer>
        ) : (
          <PaperContainer>
            <Typography variant="h6">Start a Conversation!</Typography>
          </PaperContainer>
        )}
      </ContentContainer>
    </Container>
  );
}

export default HomePage;
