import React from "react";
import { Box, styled } from "@mui/system";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Card = styled(Box)({
  width: "100%",
  padding: "1rem",
  wordBreak: "break-all",
  borderBottom: "1px solid gray",
  cursor: "pointer",
});

const Text = styled(Box)({
  fontSize: "1rem", // You can adjust the font size as needed
  boxShadow: "none", // Remove the default box shadow
});

function ContactCard(props) {
  const [cookie] = useCookies(["user_id"]);
  const navigate = useNavigate();

  console.log(props.friends);

  return props.friends.map((friend) => (
    <Card onClick={() => props.setCurFriend(friend)}>
      <Text>{friend.name}</Text>
    </Card>
  ));
}

export default ContactCard;
