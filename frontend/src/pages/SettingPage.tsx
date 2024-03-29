import React from "react";
import { Box, display, styled } from "@mui/system";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";

const Container = styled(Box)(({ theme }) => ({
  height: "100%",
  maxWidth: "100%",
  backgroundColor: theme.palette.background.default,
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  color: theme.palette.text.primary,
}));

const ThemedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function SettingPage(props) {
  console.log(props);

  const navigate = useNavigate();
  const removeCookie = props.removeCookie;
  const toggleDarkMode = props.toggleDarkMode;
  const selectedBackground = props.selectedBackground;
  const setSelectedBackground = props.setSelectedBackground;
  const customBackgrounds = props.customBackgrounds;
  const theme = useTheme();
  console.log(theme);
  console.log(customBackgrounds);

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
        Log Out
      </ThemedButton>
      <ThemedButton
        onClick={toggleDarkMode}
        sx={{ marginTop: "1vh", marginBottom: "1vh" }}
      >
        Toggle Mode
      </ThemedButton>
      <Box>Select Chat Background</Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {customBackgrounds.map((background, index) => (
          <Box
            key={index}
            sx={{
              width: "50px",
              height: "50px",
              margin: "0.2rem",
              border: `${
                index === selectedBackground
                  ? "4px solid #4FD9FF"
                  : "1px solid black"
              }`,
              borderRadius: "5%",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: "100%",
                backgroundColor: background,
                opacity: "50%",
              }}
              onClick={() => setSelectedBackground(index)}
            ></Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default SettingPage;
