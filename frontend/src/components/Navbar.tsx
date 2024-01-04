import React from "react";
import Box from "@mui/system/Box";
import { styled, useTheme } from "@mui/system";
import { Button, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import TextsmsIcon from "@mui/icons-material/Textsms";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

const Sidebar = styled(Box)(({ theme }) => ({
  width: "5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText, // Warna teks disesuaikan dengan tema
}));

const SidebarButton = styled(IconButton)(({ theme }) => ({
  margin: "10px 0",
  backgroundColor: theme.palette.secondary.main, // Warna latar belakang tombol disesuaikan dengan tema
  color: theme.palette.secondary.contrastText, // Warna teks tombol disesuaikan dengan tema
}));

const Container = styled(Box)({
  height: "100%",
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const SubContainer = styled(Box)({
  display: "flex",
  height: "100%",
  padding: 0,
  width: "auto",
  border: "1px solid lightgray",
});

function Navbar(props) {
  const setRoute = props.setRoute;
  const theme = useTheme(); // Tidak perlu meneruskan tema sebagai prop

  return (
    <>
      <Container>
        <SubContainer>
          <Sidebar theme={theme}>
            <SidebarButton onClick={() => setRoute("home")}>
              <HomeIcon />
            </SidebarButton>
            <br />
            <SidebarButton onClick={() => setRoute("chat")}>
              <TextsmsIcon />
            </SidebarButton>
            <br />
            <SidebarButton onClick={() => setRoute("addfriend")}>
              <PersonAddAlt1Icon />
            </SidebarButton>
            <br />
            <SidebarButton onClick={() => setRoute("profile")}>
              <AccountCircleIcon />
            </SidebarButton>
            <br />
            <SidebarButton onClick={() => setRoute("setting")}>
              <SettingsIcon />
            </SidebarButton>
          </Sidebar>
        </SubContainer>
      </Container>
    </>
  );
}

export default Navbar;
