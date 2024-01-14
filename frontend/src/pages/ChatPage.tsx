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
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import Popper from "@mui/material/Popper";
import { io } from "socket.io-client";
import { useTheme } from "@emotion/react";

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
  borderBottom: "1px solid black",
}));

const ChatMessageContainer = styled(Box)(({ theme }) => ({
  height: "70%",
  backgroundColor: theme.palette.background.selectedBackground, // Sesuaikan latar belakang dengan tema
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
  borderTop: "1px solid black",
  // color: theme.palette.primary.contrastText,
}));

const IconButtonContainer = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.main, // Sesuaikan warna ikon dengan tema
}));

const ButtonContainer = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Sesuaikan latar belakang tombol dengan tema
  color: theme.palette.primary.contrastText, // Sesuaikan warna teks tombol dengan tema
}));

const FriendChatBubbleContainer = styled(Box)(({ theme }) => ({
  width: "fit-content",
  margin: "1rem",
  clear: "both",
  float: "left",
  borderRadius: "10px 10px 10px 0px",
  maxWidth: "80%",
}));

const UserChatBubbleContainer = styled(Box)(({ theme }) => ({
  width: "fit-content",
  margin: "1rem",
  clear: "both",
  float: "right",
  borderRadius: "10px 10px 0px 10px",
  maxWidth: "80%",
}));

const UserChatBubble = styled(Box)(({ theme }) => ({
  padding: "1rem",
  border: "1px solid black",
  width: "fit-content",
  wordBreak: "break-all",
  borderRadius: "10px 10px 0px 10px",
  backgroundColor: theme.palette.primary.main, // Sesuaikan latar belakang tombol dengan tema
  color: theme.palette.primary.contrastText,
}));

const FriendChatBubble = styled(Box)(({ theme }) => ({
  padding: "1rem",
  border: "1px solid black",
  width: "fit-content",
  wordBreak: "break-all",
  borderRadius: "10px 10px 10px 0px",
  backgroundColor: theme.palette.primary.main, // Sesuaikan latar belakang tombol dengan tema
  color: theme.palette.primary.contrastText,
}));

const ContainerDetail = styled(Box)(({ theme }) => ({
  padding: "2vh",
  border: "1px solid black",
  height: "44vh",
  maxHeight: "auto",
  overflow: "hidden",
  backgroundColor: theme.palette.primary.main,
}));

const ContainerMember = styled(Box)(({ theme }) => ({
  padding: "1vh",
  width: "100%",
  border: "1px solid black",
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
  const selectedBackground = props.selectedBackground;
  const userFriends = props.userFriends;

  const [curFriendprofpic, setCurFriendprofpic] = useState();
  const [curGroupprofpic, setCurGroupprofpic] = useState();
  const [chat, setChat] = useState(null);
  const [member, setMember] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileGroup, setSelectedFileGroup] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorE2, setAnchorE2] = React.useState<null | HTMLElement>(null);
  const [anchorE3, setAnchorE3] = React.useState<null | HTMLElement>(null);
  const [tempFile, setTempFile] = useState("");
  const [tempFileGroup, setTempFileGroup] = useState("");
  const [inviteMember, setInviteMember] = useState(false);
  const [inviteable, setInviteable] = useState(null);
  const fileInputRef = useRef(null);
  const socket = io("http://localhost:3000");
  const scrollRef = useRef();
  const theme = useTheme();
  const [kondisi, setKondisi] = useState(false)

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const openEmoji = Boolean(anchorE3);
  const idEmoji = openEmoji ? "simple-popper" : undefined;
  const EmojiList = [
    "😀",
    "😁",
    "😂",
    "🤣",
    "😃",
    "😄",
    "😅",
    "😆",
    "😉",
    "😊",
    "😋",
    "😎",
    "😍",
    "😘",
    "🥰",
    "😗",
    "😙",
    "🥲",
    "😚",
    "☺️",
    "🙂",
    "🤗",
    "🤩",
    "🤔",
    "🫡",
    "🤨",
    "😐",
    "😑",
    "😶",
    "🫥",
    "😶‍🌫️",
    "🙄",
    "😏",
    "😣",
    "😥",
    "😮",
    "🤐",
    "😯",
    "😪",
    "😫",
    "🥱",
    "😴",
    "😌",
    "😛",
    "😜",
    "😝",
    "🤤",
    "😒",
    "😓",
    "😔",
    "😕",
    "🫤",
    "🙃",
    "🫠",
    "🤑",
    "😲",
    "☹️",
    "🙁",
    "😖",
    "😞",
    "😟",
    "😤",
    "😢",
    "😭",
    "😦",
    "😧",
    "😨",
    "😩",
    "🤯",
    "😬",
    "😮‍💨",
    "😰",
    "😱",
    "🥵",
    "🥶",
    "😳",
    "🤪",
    "😵",
    "😵‍💫",
    "🥴",
    "😠",
    "😡",
    "🤬",
    "😷",
    "🤒",
    "🤕",
    "🤢",
    "🤮",
    "🤧",
    "😇",
    "🥳",
    "🥸",
    "🥺",
    "🥹",
    "🤠",
    "🤡",
    "🤥",
    "🫨",
    "🤫",
    "🤭",
    "🫢",
    "🫣",
    "🧐",
    "🤓",
    "😈",
    "👿",
    "👹",
    "👺",
    "💀",
    "☠️",
  ];

  const handleClickPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickPopperDetail = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE2(anchorE2 ? null : event.currentTarget);
  };

  const handlePopDetailClose = () => {
    setAnchorE2(null);
  };

  const handleEmojiButtonClicked = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE3(anchorE3 ? null : event.currentTarget);
  };

  const handleEmojiClicked = (e) => {
    console.log(e.target.value);

    setNewMessage(newMessage + e.target.value);
  };

  // image chat
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

  // group image
  const handleFileChangeGroup = (event) => {
    const file = event.target.files[0];
    setSelectedFileGroup(file);
    setTempFileGroup(file);
    // displayImageGroup(file);
    console.log("masuk sini ");
  };

  const handleDragOverGroup = (event) => {
    event.preventDefault();
  };

  const handleClickGroup = () => {
    // Trigger the file input when the drop zone is clicked
    fileInputRef.current.click();
  };

  // const displayImageGroup = (file) => {
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       // Create an image element and set the data URL as its source
  //       const imgElement = document.createElement("img");
  //       imgElement.src = e.target.result;
  //       imgElement.alt = "Selected Image";

  //       imgElement.style.marginLeft = "auto";
  //       imgElement.style.marginRight = "auto";
  //       imgElement.style.height = "10rem";
  //       imgElement.style.width = "10rem";
  //       imgElement.style.objectFit = "cover";
  //       imgElement.style.borderRadius = "50%";
  //       imgElement.style.border = "1px solid black";

  //       // Append the image element to the component
  //       document.getElementById("imageContainerGroup").innerHTML = "";
  //       document.getElementById("imageContainerGroup").appendChild(imgElement);
  //     };

  //     // Use readAsDataURL for images
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleDropGroup = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFileGroup(file);
    setTempFileGroup(file);
    // displayImageGroup(file);
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
        if (curFriend) {
          const result = await axios.post(
            `http://localhost:3000/api/users/friend/chatImage/${curUserId}/${curFriend.friendId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else if (curGroup) {
          const result2 = await axios.post(
            `http://localhost:3000/api/users/group/chatImageGroup/${curGroup.idGroup}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }
        setAnchorEl(null);
        setSelectedFile(null);
      }

      // Update the chat after sending the messagesetChat
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

  const fetchInviteable = () => {
    let temp;

    console.log(member);
    console.log(userFriends);

    const result = userFriends.filter(
      (friend) => !member.some((member) => member.userId === friend.friendId)
    );

    setInviteable(result);
    console.log(result);
  };

  const scrollToLatestMessage = () => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
    });
  };

  const handleInviteMember = async (id) => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        `http://localhost:3000/api/group-chats/${curGroup.idGroup}/addMember`,
        { memberId: id }
      );
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
    } else if (curGroup) {
      axios
        .get(
          `http://localhost:3000/api/group-chats/picGroup/${curGroup.idGroup}`
        )
        .then((res) => {
          setCurGroupprofpic(res.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      fetchChat();
      fetchMember();
    }
  }, [curFriend, curGroup, curGroupprofpic]);

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
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
    });
  }, [chat]);

  useEffect(() => {
    member && fetchInviteable();
  }, [member]);

  useEffect(() => {
    if (selectedFileGroup) {
      const formData = new FormData();
      formData.append("file", selectedFileGroup);
      axios.post(
        `http://localhost:3000/api/group-chats/picGroup/profpicGroup/${curGroup.idGroup}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedProfGroup = axios
      .get(
        `http://localhost:3000/api/group-chats/picGroup/${curGroup.idGroup}`
      )
      .then((res) => {
        setCurGroupprofpic(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
      // setSelectedFileGroup(null)
    }
  }, [selectedFileGroup]);

  console.log(curFriend);
  console.log(curGroup);

  return (
    <>
      <Container>
        {/* gambar dan nama*/}
        <FriendDetailContainer>
          <FlexContainer onClick={handleClickPopperDetail}>
            <IconButton
              onClick={() => {
                setCurFriend(null);
                setCurGroup(null);
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    marginLeft: "1vw",
                  }}
                >
                  {curFriend.name}
                </Box>
              </>
            ) : curGroup ? (
              //ini kalau chat sama group
              <>
                {/* ini PP group */}
                <AvatarImage
                  alt="Group Image"
                  src={
                    curGroupprofpic
                      ? `http://localhost:3000/api/group-chats/picGroup/${curGroup.idGroup}`
                      : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                  }
                />

                {/* ini nama group */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "1.4rem",
                    fontWeight: "bold",
                    marginLeft: "1vw",
                  }}
                >
                  {curGroup.name}
                </Box>
              </>
            ) : (
              //ini kalau belum ke load
              "loading"
            )}
          </FlexContainer>

          {/* ini pop up detail group / friend */}
          <Popover
            open={Boolean(anchorE2)}
            anchorEl={anchorE2}
            onClose={handlePopDetailClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left", // Sesuaikan agar Popover tepat berada di bawah FriendDetailContainer
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left", // Sesuaikan agar Popover tepat berada di bawah FriendDetailContainer
            }}
          >
            {/* Ini isi popup nya */}
            <Box sx={{ width: "23vw" }}>
              {curFriend ? (
                <ContainerDetail>
                  <Box>
                    <AvatarImage
                      src={
                        curFriendprofpic
                          ? `http://localhost:3000/api/users/pic/${curFriend.friendId}`
                          : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                      }
                    // sx={{ margin: "auto" }}
                    />
                  </Box>
                  <Box>{curFriend.name}</Box>
                  <Box>{curFriend.phoneNumber}</Box>
                </ContainerDetail>
              ) : curGroup ? (
                member && (
                  <ContainerDetail>
                    {!inviteMember ? (
                      <>
                        {/* ini nama sama pp */}
                        <Box sx={{ textAlign: "center", fontWeight: "bold" }}>
                          {/* ini pp */}
                          <Box
                            sx={{
                              margin: "auto",
                              width: "fit-content",
                            }}
                          >
                            <FlexContainer>
                              <AvatarImage
                                src={
                                  curGroupprofpic
                                    ? `http://localhost:3000/api/group-chats/picGroup/${curGroup.idGroup}`
                                    : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                                }
                                sx={{ margin: "auto" }}
                              />

                              <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={handleFileChangeGroup}
                                ref={fileInputRef}
                                accept=".jpeg, .jpg, .png"
                              />
                              <div
                                onClick={handleClickGroup}
                                onDrop={handleDropGroup}
                                onDragOver={handleDragOverGroup}
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                  marginTop: "auto",
                                  height: "auto",
                                }}
                              >
                                <IconButton>
                                  <EditIcon />
                                </IconButton>
                              </div>
                            </FlexContainer>
                          </Box>

                          {/* ini nama */}
                          {curGroup.name}
                        </Box>

                        {/* ini member */}
                        <Box>Members</Box>
                        <Box
                          sx={{
                            height: "20vh",
                            overflow: "auto",
                            borderTop: "1px solid black",
                            borderBottom: "1px solid black",
                          }}
                        >
                          {/* ini mapping membernya */}
                          {member.map((user) => (
                            <ContainerMember
                              onClick={() => {
                                setCurFriend({ friendId: user.userId });
                                setCurGroup(null);
                              }}
                              style={{
                                pointerEvents: `${user.userId === curUserId ? "none" : "auto"
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

                          {/* ini button invite mmeber (muncul kalau admin) */}
                        </Box>
                        <Box
                          sx={{
                            marginTop: "auto",
                            width: "100%",
                          }}
                        >
                          {curGroup.admin.userId === curUserId && (
                            <Button
                              onClick={() => setInviteMember(true)}
                              sx={{
                                color: "black",
                                width: "100%",
                              }}
                            >
                              invite member
                            </Button>
                          )}
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <IconButton onClick={() => setInviteMember(false)}>
                          <ArrowBackIosNewIcon />
                        </IconButton>
                        Back
                        <Box
                          sx={{
                            borderBottom: "1px solid black",
                            overflow: "auto",
                          }}
                        >
                          {inviteable &&
                            inviteable.map((friend) => (
                              <ContainerMember>
                                <FlexContainer
                                  sx={{ alignItems: "center" }}
                                  onClick={() =>
                                    handleInviteMember(friend.friendId)
                                  }
                                >
                                  <MemberImage alt="Member Profile Picture" />
                                  <Box sx={{ marginLeft: "1vw" }}>
                                    {friend.name}
                                  </Box>
                                </FlexContainer>
                              </ContainerMember>
                            ))}
                        </Box>
                      </Box>
                    )}
                  </ContainerDetail>
                )
              ) : (
                "loading"
              )}
            </Box>
          </Popover>
        </FriendDetailContainer>

        {/* tempat message nya */}
        <ChatMessageContainer
          sx={{ backgroundColor: theme.palette.background[selectedBackground] }}
        >
          {chat
            ? chat.map((message, index) =>
              message.senderId === curUserId ? (
                <UserChatBubbleContainer key={index} ref={scrollRef}>
                  <UserChatBubble>
                    {message.content.includes("jpg") ||
                      message.content.includes("png") ||
                      message.content.includes("jpeg") ? (
                      <img
                        alt="Image Chat"
                        src={
                          curGroup == null
                            ? `http://localhost:3000/api/users/messagePic/${message._id}`
                            : `http://localhost:3000/api/users/messagePicGroup/${message._id}`
                        }
                        width={300}
                      />
                    ) : (
                      <>{message.content}</>
                    )}
                  </UserChatBubble>
                </UserChatBubbleContainer>
              ) : (
                <FriendChatBubbleContainer key={index} ref={scrollRef}>
                  <Box>{message.sender}</Box>
                  <FriendChatBubble>
                    {message.content.includes("jpg") ||
                      message.content.includes("png") ||
                      message.content.includes("jpeg") ? (
                      <img
                        alt="Image Chat"
                        src={
                          curGroup == null
                            ? `http://localhost:3000/api/users/messagePic/${message._id}`
                            : `http://localhost:3000/api/users/messagePicGroup/${message._id}`
                        }
                        width={300}
                      />
                    ) : (
                      <>{message.content}</>
                    )}
                  </FriendChatBubble>
                </FriendChatBubbleContainer>
              )
            )
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
            aria-describedby={idEmoji}
            onClick={handleEmojiButtonClicked}
          >
            <EmojiIcon />
          </IconButtonContainer>

          {/* pop up emoji */}
          <Popper
            id={idEmoji}
            open={openEmoji}
            anchorEl={anchorE3}
            placement="top"
          >
            {/* Ini isi popup nya */}
            <Box
              sx={{
                width: "19vw",
                height: "32vh",
                background: theme.palette.primary.main,
                border: `1px solid black`,
                borderRadius: "10px",
              }}
            >
              <Box
                sx={{ textAlign: "center", fontSize: "1.3rem", height: "5vh" }}
              >
                Emoticons
              </Box>
              <Box
                sx={{
                  overflow: "auto",
                  height: "25vh",
                }}
              >
                {EmojiList.map((emoji) => (
                  <IconButton
                    sx={{ color: "rgb( 0, 0, 0, 1)" }}
                    onClick={handleEmojiClicked}
                    value={emoji}
                  >
                    {emoji}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Popper>

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
