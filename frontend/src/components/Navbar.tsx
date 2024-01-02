import React, { useState } from "react";
import Box from "@mui/system/Box";
import { styled } from "@mui/system";
import { Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Button } from "@mui/material";
import HomePage from "../pages/HomePage";

const Sidebar = styled(Box)({
  width: "5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "gray",
  wordBreak: "break-all",
});

const OutletWrapper = styled(Box)({
  /* Add additional styles as needed */
});

const Container = styled(Box)({
  height: "96vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const SubContainer = styled(Box)({
  display: "flex",
  height: "90vh",
  padding: 0,
  width: "auto",
  border: "1px solid lightgray",
});

function Navbar() {
  const [cookie, setCookie, removeCookie] = useCookies(["user_id"]);
  const [route, setRoute] = useState("home");
  const navigate = useNavigate();
  return (
    <>
      <Container>
        <SubContainer>
          <Sidebar>
            {/* ini navigasi nnti ada home, pinned msg, profile, dsb */}
            <Button variant="contained" onClick={() => setRoute("home")}>
              Home
            </Button>
            <br />
            <Button variant="contained" onClick={() => setRoute("profile")}>
              Profile
            </Button>
            <br />
            <Button
              variant="contained"
              onClick={() => {
                navigate("/login");
                removeCookie("user_id");
              }}
            >
              Logout
            </Button>
            <br />
            <Button variant="contained" onClick={() => setRoute("setting")}>
              Setting
            </Button>
          </Sidebar>
          <OutletWrapper>
            <HomePage route={route} />
          </OutletWrapper>
        </SubContainer>
      </Container>
    </>
  );
}

export default Navbar;
