import React, { Suspense, useEffect, useState, useRef } from "react";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { border, styled } from "@mui/system";
import axios from "axios";
import { Button, IconButton, Popover, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiIcon from "@mui/icons-material/EmojiEmotions";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
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

const FriendDetailContainer = styled(Box)(({ theme }) => ({
  height: "15%",
  backgroundColor: theme.palette.primary.main, // Sesuaikan latar belakang dengan tema
  display: "flex",
  alignItems: "center",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  color: theme.palette.primary.contrastText,
  cursor: "pointer",
}));

const ChatMessageContainer = styled(Box)(({ theme }) => ({
  height: "70%",
  backgroundColor: theme.palette.background.default, // Sesuaikan latar belakang dengan tema
  overflow: "auto",
  position: "relative",
}));

const UserInputField = styled(Box)(({ theme }) => ({
  height: "15%",
  backgroundColor: theme.palette.primary.main, // Sesuaikan latar belakang dengan tema
  display: "flex",
  alignItems: "center",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  color: "black",
  // color: theme.palette.primary.contrastText,
}));

const IconButtonContainer = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.main, // Sesuaikan warna ikon dengan tema
}));

const ButtonContainer = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Sesuaikan latar belakang tombol dengan tema
  color: theme.palette.primary.contrastText, // Sesuaikan warna teks tombol dengan tema
}));

const ChatBubble = styled(Box)(({ theme }) => ({
  padding: "1rem",
  border: "1px solid black",
  width: "fit-content",
  margin: "1rem",
  clear: "both",
  wordBreak: "break-all",
  backgroundColor: theme.palette.primary.main, // Sesuaikan latar belakang tombol dengan tema
  color: theme.palette.primary.contrastText,
}));

const ContainerDetail = styled(Box)(({ theme }) => ({
  border: "1px solid black",
  backgroundColor: theme.palette.primary.main,
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

function ChatPage(props) {
  const curUserId = props.curUserId;
  const curFriend = props.curFriend;
  const setCurFriend = props.setCurFriend;
  const curGroup = props.curGroup;
  const setCurGroup = props.setCurGroup;
  const [curFriendprofpic, setCurFriendprofpic] = useState();
  const [chat, setChat] = useState(null);
  const [member, setMember] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorE2, setAnchorE2] = React.useState<null | HTMLElement>(null);
  const [tempFile, setTempFile] = useState("");
  const fileInputRef = useRef(null);
  const socket = io("http://localhost:3000");
  const scrollRef = useRef();

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleClickPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickPopperDetail = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE2(anchorE2 ? null : event.currentTarget);
  };

  const handlePopDetailClose = () => {
    setAnchorE2(null);
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

      if (curFriend) {
        const response = await axios.post(
          "http://localhost:3000/api/users/send-message",
          {
            userId: curUserId,
            friendId: curFriend.friendId,
            content: selectedFile ? selectedFile.name : newMessage,
          }
        );
      } else if (curGroup) {
        const response = await axios.post(
          `http://localhost:3000/api/group-chats/${curGroup.idGroup}/sendMessage`,
          {
            senderId: curUserId,
            content: selectedFile ? selectedFile.name : newMessage,
          }
        );
      }

      socket.emit(
        "chat message",
        selectedFile ? selectedFile.name : newMessage
      );

      if (selectedFile) {
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
    if (curFriend) {
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
    } else if (curGroup) {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `http://localhost:3000/api/group-chats/${curGroup.idGroup}/messages`
        );
        setChat(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }
  };

  const fetchMember = async () => {
    if (curGroup) {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `http://localhost:3000/api/group-chats/${curGroup.idGroup}/details`
        );
        const members = [];
        members.push(response.data.admin);
        response.data.members.map((member) => members.push(member));
        setMember(members);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }
  };

  const scrollToLatestMessage = () => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
    });
  };

  const handleEmojiButtonClicked = () => {};

  const handleInviteMember = async () => {};

  useEffect(() => {
    setChat(null);
    console.log(curFriend);

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
    } else if (curGroup) {
      // axios
      //   .get(`http://localhost:3000/api/group-chats/pi${curFriend.friendId}`)
      //   .then((res) => {
      //     setCurFriendprofpic(res.data);
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching data:", error);
      //   });

      fetchChat();
      fetchMember();
    }

    console.log(curFriend);
    console.log(curGroup);
  }, [curFriend, curGroup]);

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

  useEffect(() => {
    console.log(member);
  }, [member]);

  return (
    <>
      <Container>
        {/* gambar dan nama*/}
        <FriendDetailContainer>
          <FlexContainer onClick={handleClickPopperDetail}>
            <div
              onClick={() => {
                setCurFriend(null);
                setCurGroup(null);
              }}
            >
              ↩️
            </div>

            {curFriend ? (
              // ini kalau chat sama friend
              <>
                {/* ini PP friend */}
                <AvatarImage
                  alt="Friend Image"
                  src={
                    curFriendprofpic
                      ? `http://localhost:3000/api/users/pic/${curFriend.friendId}`
                      : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                  }
                />

                {/* ini nama friend */}
                <Paper style={{ textAlign: "left" }}>
                  {curFriend.name} <br />
                  🟢online
                </Paper>
              </>
            ) : curGroup ? (
              //ini kalau chat sama group
              <>
                {/* ini PP group */}
                <AvatarImage
                  alt="Group Image"
                  src={
                    "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                    // curFriendprofpic
                    //   ? `http://localhost:3000/api/users/pic/${curFriend.friendId}`
                    //   : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                  }
                />

                {/* ini nama group */}
                <Paper style={{ textAlign: "left" }}>
                  {curGroup.name} <br />
                  🟢online
                </Paper>
              </>
            ) : (
              //ini kalau belum ke load
              "loading"
            )}
          </FlexContainer>

          {/* ini pop up detail group / friend */}
          <Popover
            open={Boolean(anchorE2)}
            anchorE2={anchorE2}
            onClose={handlePopDetailClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center", // Sesuaikan agar Popover tepat berada di bawah FriendDetailContainer
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center", // Sesuaikan agar Popover tepat berada di bawah FriendDetailContainer
            }}
          >
            {/* Ini isi popup nya */}
            <Box sx={{ width: "23vw" }}>
              {curFriend ? (
                <ContainerDetail>
                  <Box>ini pp</Box>
                  <Box>{curFriend.name}</Box>
                </ContainerDetail>
              ) : curGroup ? (
                member && (
                  <ContainerDetail>
                    <Box>ini pp</Box>
                    <Box>{curGroup.name}</Box>
                    <Box>Members</Box>
                    <Box>
                      {member.map((user) => (
                        <ContainerMember
                          onClick={() => {
                            setCurFriend({ friendId: user.userId });
                            setCurGroup(null);
                          }}
                          style={{
                            pointerEvents: `${
                              user.userId === curUserId ? "none" : "auto"
                            }`,
                            cursor: "pointer",
                          }}
                        >
                          <FlexContainer>
                            <MemberImage alt="Member Profile Picture" />
                            <Box>{user.name}</Box>
                            {user.role === "admin" && (
                              <Box sx={{ marginLeft: "auto" }}>admin</Box>
                            )}
                          </FlexContainer>
                        </ContainerMember>
                      ))}
                      {console.log(curGroup)}
                      {curGroup.admin.userId === curUserId && (
                        <Button
                          onClick={handleInviteMember}
                          sx={{ color: "black" }}
                        >
                          invite member
                        </Button>
                      )}
                    </Box>
                  </ContainerDetail>
                )
              ) : (
                "loading"
              )}
            </Box>
          </Popover>
        </FriendDetailContainer>

        {/* tempat message nya */}
        <ChatMessageContainer>
          {chat
            ? chat.map((message, index) => (
                <ChatBubble
                  key={index}
                  ref={scrollRef}
                  style={{
                    float: message.senderId === curUserId ? "right" : "left",
                    borderRadius:
                      message.senderId === curUserId
                        ? "10px 10px 0px 10px"
                        : "10px 10px 10px 0px",
                    maxWidth: "80%",
                  }}
                >
                  {message.content.includes("jpg") ||
                  message.content.includes("png") ||
                  message.content.includes("jpeg") ? (
                    <img
                      alt="Image Chat"
                      src={`http://localhost:3000/api/users/messagePic/${message._id}`}
                      width={300}
                    />
                  ) : (
                    message.content
                  )}
                </ChatBubble>
              ))
            : "loading..."}
          <ExpandCircleDownIcon
            onClick={scrollToLatestMessage}
            sx={{
              position: "fixed",
              bottom: "20%",
              right: "7%",
              zIndex: 999,
              height: "40px",
              width: "40px",
            }}
          />
        </ChatMessageContainer>

        {/* input */}
        <UserInputField>
          {/* button emoji */}
          <IconButtonContainer
            aria-label="emoji"
            color="secondary"
            onClick={handleEmojiButtonClicked}
          >
            <EmojiIcon />
          </IconButtonContainer>

          {/* button upload foto */}
          <IconButtonContainer
            aria-describedby={id}
            onClick={handleClickPopper}
          >
            <AddAPhotoIcon color="secondary" />
          </IconButtonContainer>

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
          <ButtonContainer
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
          >
            Send
          </ButtonContainer>
        </UserInputField>
      </Container>
    </>
  );
}

export default ChatPage;
