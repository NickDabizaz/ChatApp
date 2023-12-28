import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

function ContactCard(props) {
  console.log(props.friends);

  const Card = styled(Paper)({
    width: "80%",
    padding: "1rem",
    marginBottom: "1rem",
  });

  return props.friends.map((friend) => (
    <Card elevation={3}>
      <Typography variant="h6">{friend.name}</Typography>
      <Typography variant="body2" color="textSecondary">
        {friend.messages.length > 0 &&
          friend.messages[friend.messages.length - 1].content}
      </Typography>
    </Card>
  ));
}

export default ContactCard;
