import React from "react";
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
  return props.friends.map(
    (friend) =>
      friend.messages.lenght > 0 && (
        <Card
          elevation={3}
          onClick={() =>
            // navigate(`/home/chat/${friend.friendId}`)
            props.setCurFriend(friend)
          }
        >
          <Typography variant="h6">{friend.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {/* masih salah, yang ditampilin message trakhir meskipun dari diri sendiri */}
            {friend.messages[friend.messages.length - 1].content}
          </Typography>
        </Card>
      )
  );
}

export default ChatCard;
