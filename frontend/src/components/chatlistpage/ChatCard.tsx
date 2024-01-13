import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Card = styled(Paper)({
  width: "100%",
  padding: "1rem",
  marginBottom: "1rem",
  wordBreak: "break-all",
});

function ChatCard(props) {
  const [latestMessage, setLatestMessage] = useState(null);
  const type = props.chat.type;
  const curUserId = props.curUserId;

  useEffect(() => {
    const fetchChatLatestMessage = async () => {
      try {
        let response;
        if (type === "friend") {
          response = await axios.get(
            `http://localhost:3000/api/users/last-message/${curUserId}/${props.chat.friendId}`
          );
        } else if (type === "group") {
          response = await axios.get(
            `http://localhost:3000/api/group-chats/${props.chat.idGroup}/last-message`
          );
        }
        setLatestMessage(response.data);
      } catch (error) {
        setLatestMessage(null);
        console.error("Error fetching user data", error);
      }
    };

    if (props.chat) fetchChatLatestMessage();
  }, [props]);

  return (
    <>
      {props.chat && latestMessage && (
        <Card
          elevation={3}
          onClick={() => {
            if (type === "friend") {
              props.setCurFriend(props.chat);
              props.setCurGroup(null);
            } else if (type === "group") {
              props.setCurFriend(null);
              props.setCurGroup(props.chat);
            }
          }}
        >
          <Typography variant="h6">{props.chat.name}</Typography>{" "}
          <Typography variant="body2" color="textSecondary">
            {" "}
            {latestMessage && latestMessage.content}
          </Typography>
        </Card>
      )}
    </>
  );
}

export default ChatCard;
