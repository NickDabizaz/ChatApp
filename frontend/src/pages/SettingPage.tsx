import React from "react";
import { Box, styled } from "@mui/system";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const Container = styled(Box)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.background.default,
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
}));

const ThemedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function SettingPage(props) {
  const navigate = useNavigate();
  const removeCookie = props.removeCookie;
  const toggleDarkMode = props.toggleDarkMode;

  return (
    <Container>
      <ThemedButton
        variant="contained"
        onClick={() => {
          navigate("/login");
          removeCookie("user_id");
        }}
      >
        <LogoutIcon />
      </ThemedButton>
      <ThemedButton onClick={toggleDarkMode}>Toggle Mode</ThemedButton>
    </Container>
  );
}

export default SettingPage;
