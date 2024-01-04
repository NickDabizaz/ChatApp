import React, { Suspense, useEffect, useState, useRef } from "react";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/system";
import axios from "axios";
import { Button, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiIcon from "@mui/icons-material/EmojiEmotions";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Popper from "@mui/material/Popper";
import { io } from "socket.io-client";

const Container = styled(Box)({
  width: "100%",
  maxWidth: "100%",
  height: "100%",
  maxHeight: "100%",
});

const FlexContainer = styled(Box)({
  display: "flex",
  width: "100%",
});

const AvatarImage = styled(Avatar)({
  width: "4rem",
  height: "4rem",
});

const ChatMessageContainer = styled(Box)({
  height: "78%",
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

function ChatPage(props) {
  const curFriend = props.curFriend;
  const setCurFriend = props.setCurFriend;
  const curUserId = props.curUserId;
  const [curFriendprofpic, setCurFriendprofpic] = useState();
  const [chat, setChat] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tempFile, setTempFile] = useState("");
  const fileInputRef = useRef(null);
  const socket = io("http://localhost:3000");
  const scrollRef = useRef();

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleClickPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setTempFile(file);
    displayImage(file);
    console.log("masuk sini ");
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

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    setTempFile(file);
    displayImage(file);
    console.log("masuk handle drop");
  };

  const handleSendMessage = async () => {
    try {
      // Replace with your actual API endpoint

      console.log(selectedFile);

      const response = await axios.post(
        "http://localhost:3000/api/users/send-message",
        {
          userId: curUserId,
          friendId: curFriend.friendId,
          content: selectedFile ? selectedFile.name : newMessage,
        }
      );

      socket.emit(
        "chat message",
        selectedFile ? selectedFile.name : newMessage
      );

      if (selectedFile) {
        console.log("masuk ga");
        const formData = new FormData();
        formData.append("file", selectedFile);
        const result = await axios.post(
          `http://localhost:3000/api/users/chatImage/${curUserId}/${curFriend.friendId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setAnchorEl(null);
        setSelectedFile(null);
      }

      // Update the chat after sending the message
      fetchChat();
      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message", error);
    }
  };
  const fetchChat = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(
        `http://localhost:3000/api/users/chat-history/${curUserId}/${curFriend.friendId}`
      );
      setChat(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

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

  useEffect(() => {
    // Listen for incoming chat messages
    socket.on("chat message", (msg) => {
      // alert(msg)
      fetchChat();
    });

    return () => {
      socket.disconnect();
    };
  }, [chat]);

  useEffect(() => {
    console.log("scroll");
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
    });
  }, [chat]);

  return (
    <>
      <Container>
        {/* gambar teman, nama dan status */}
        <FlexContainer>
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
        </FlexContainer>

        {/* tempat message nya */}
        <ChatMessageContainer>
          {chat
            ? chat.map((message, index) => (
                <div
                  key={index}
                  ref={scrollRef}
                  style={{
                    padding: "1rem",
                    border: "1px solid black",
                    width: "fit-content",
                    margin: "1rem",
                    float: `${
                      message.senderId === curUserId ? "right" : "left"
                    }`,
                    borderRadius: `${
                      message.senderId === curUserId
                        ? "10px 10px 0px 10px"
                        : "10px 10px 10px 0px"
                    }`,
                    clear: "both",
                    wordBreak: "break-all",
                  }}
                >
                  {message.content.includes("jpg") || message.content.includes("png") || message.content.includes("jpeg") ? (
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
          {/* button emoji */}
          <IconButton aria-label="emoji" color="secondary">
            <EmojiIcon />
          </IconButton>

          {/* button upload foto */}
          <button
            aria-describedby={id}
            type="button"
            onClick={handleClickPopper}
          >
            <AddAPhotoIcon color="secondary" />
          </button>

          {/* pop up upload foto */}
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
      </Container>
    </>
  );
}

export default ChatPage;
