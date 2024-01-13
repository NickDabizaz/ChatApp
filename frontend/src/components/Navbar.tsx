import React from "react";
import Box from "@mui/system/Box";
import { styled, useTheme } from "@mui/system";
import { Button, IconButton, StyledComponentProps } from "@mui/material";
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

const SidebarButton = styled(IconButton)<
  StyledComponentProps & { isActive: boolean }
>(({ theme, isActive }) => ({
  margin: "10px 0",
  backgroundColor: isActive
    ? theme.palette.primary.main
    : theme.palette.secondary.main,
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
});

function Navbar(props) {
  const route = props.route;
  const setRoute = props.setRoute;
  const theme = useTheme(); // Tidak perlu meneruskan tema sebagai prop

  return (
    <>
      <Container>
        <SubContainer>
          <Sidebar theme={theme}>
            <SidebarButton
              onClick={() => setRoute("home")}
              isActive={route === "home"}
            >
              <HomeIcon />
            </SidebarButton>
            <br />
            <SidebarButton
              onClick={() => setRoute("chat")}
              isActive={route === "chat"}
            >
              <TextsmsIcon />
            </SidebarButton>
            <br />
            <SidebarButton
              onClick={() => setRoute("addfriend")}
              isActive={route === "addfriend"}
            >
              <PersonAddAlt1Icon />
            </SidebarButton>
            <br />
            <SidebarButton
              onClick={() => setRoute("profile")}
              isActive={route === "profile"}
            >
              <AccountCircleIcon />
            </SidebarButton>
            <br />
            <SidebarButton
              onClick={() => setRoute("setting")}
              isActive={route === "setting"}
            >
              <SettingsIcon />
            </SidebarButton>
          </Sidebar>
        </SubContainer>
      </Container>
    </>
  );
}

export default Navbar;
