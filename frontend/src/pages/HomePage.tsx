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
import EditProfilePage from "./ProfilePage";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Popper from "@mui/material/Popper";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { io } from "socket.io-client";

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

const AvatarImage = styled(Avatar)({
  width: "4rem",
  height: "4rem",
});

const FlexContainer = styled(Box)({
  display: "flex",
  width: "100%",
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
  backgroundColor: "red",
});

const FriendListCardContainer = styled(Box)({
  width: "100%",
  height: "auto",
  borderTop: "1px solid gray",
});

function HomePage(props) {
  const userData = props.userData;
  const userProfpic = props.userProfpic;
  const curUserId = props.curUserId;
  const setCurFriend = props.setCurFriend;
  console.log(curUserId);

  return (
    <Container>
      {/* content kiri */}
      <LeftContainer>
        {userData ? (
          <HomeContainer>
            {/* ini pp sama nama */}
            <FlexContainer>
              <AvatarImage
                alt="Profile picture"
                src={
                  userProfpic
                    ? `http://localhost:3000/api/users/pic/${curUserId}`
                    : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                }
              />
              {userData.name}
            </FlexContainer>

            {/* ini container dropdown Friends */}
            <FriendListContainer>
              {/* ini dropdown Friends  */}
              <Accordion sx={{ boxShadow: "none" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  Friends
                </AccordionSummary>

                {/* ini isi dropdown Friends */}
                <AccordionDetails>
                  {/* ini container contact card */}
                  <FriendListCardContainer>
                    {/* ini contact card */}
                    <ContactCard
                      friends={userData.friends}
                      setCurFriend={setCurFriend}
                    />
                  </FriendListCardContainer>
                </AccordionDetails>
              </Accordion>
            </FriendListContainer>

            <FriendListContainer>
              {/* ini drop down Groups */}
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Groups</Typography>
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
        ) : (
          "loading..."
        )}
      </LeftContainer>
    </Container>
  );
}

export default HomePage;
