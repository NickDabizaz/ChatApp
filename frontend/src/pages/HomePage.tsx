import React from "react";
import Box from "@mui/system/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import ContactCardFriend from "../components/homepage/ContactCardFriend";
import ContactCardGroup from "../components/homepage/ContactCardGroup";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "89vh",
  maxHeight: "90vh",
  padding: "1rem",
  backgroundColor: theme.palette.background.default,
  // justifyContent: "center",
  // alignItems: "center",
}));

const LeftContainer = styled(Box)(({ theme }) => ({
  minWidth: "20rem",
  height: "100%",
  backgroundColor: theme.palette.background.default, // Sesuaikan latar belakang dengan tema
}));

const AvatarImage = styled(Avatar)({
  width: "4rem",
  height: "4rem",
});

const FlexContainer = styled(Box)({
  display: "flex",
  width: "100%",
});

const HomeContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  backgroundColor: theme.palette.background.default, // Sesuaikan latar belakang dengan tema
  overflow: "auto",
  color: "black",
  // color: theme.palette.primary.contrastText,
}));

const FriendListContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "auto",
  // backgroundColor: theme.palette.secondary.main, // Sesuaikan latar belakang dengan tema
}));

const FriendListCardContainer = styled(Box)({
  width: "100%",
  height: "auto",
  borderTop: "1px solid gray",
});

function HomePage(props) {
  const userData = props.userData;
  const userProfpic = props.userProfpic;
  const curUserId = props.curUserId;
  const userFriends = props.userFriends;
  const setCurFriend = props.setCurFriend;
  const userGroups = props.userGroups;
  const setCurGroup = props.setCurGroup;
  console.log(props);

  return (
    <Container>
      {/* content kiri */}
      {userData ? (
        <HomeContainer>
          {/* ini pp sama nama */}
          <FlexContainer sx={{ alignItems: "center" }}>
            <AvatarImage
              alt="Profile picture"
              src={
                userProfpic
                  ? `http://localhost:3000/api/users/pic/${curUserId}`
                  : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
              }
            />
            <Box
              sx={{ marginLeft: "1vw", fontSize: "1.2rem", fontWeight: "bold" }}
            >
              {userData.name} <br />
              <Box sx={{ fontSize: "0.8rem" }}>{userData.phoneNumber}</Box>
            </Box>
          </FlexContainer>

          {/* ini container dropdown Friends */}
          <FriendListContainer>
            {/* ini dropdown Friends  */}
            <Accordion sx={{ boxShadow: "none" }}>
              {/* ini tulisan di dropdownnya */}
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
                  <ContactCardFriend
                    friends={userFriends}
                    setCurFriend={setCurFriend}
                    setCurGroup={setCurGroup}
                  />
                </FriendListCardContainer>
              </AccordionDetails>
            </Accordion>
          </FriendListContainer>

          <FriendListContainer>
            {/* ini drop down Groups */}
            <Accordion sx={{ boxShadow: "none" }}>
              {/* ini tulisan di dropdownnya */}
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Groups</Typography>
              </AccordionSummary>

              {/* ini isi dropdown Groups */}
              <AccordionDetails>
                <FriendListCardContainer>
                  <ContactCardGroup
                    groups={userGroups}
                    setCurGroup={setCurGroup}
                    setCurFriend={setCurFriend}
                  />
                </FriendListCardContainer>
              </AccordionDetails>
            </Accordion>
          </FriendListContainer>
        </HomeContainer>
      ) : (
        "loading..."
      )}
    </Container>
  );
}

export default HomePage;
