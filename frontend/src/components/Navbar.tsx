import React from "react";
import Box from "@mui/system/Box";
import { styled } from "@mui/system";
import { Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Sidebar = styled(Box)({
  flex: 1,
  backgroundColor: "#f0f0f0",
  //   padding: "1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "gray",
  wordBreak: "break-all",
});

const OutletWrapper = styled(Box)({
  flex: 20,
  /* Add additional styles as needed */
});

const Container = styled(Box)({
  display: "flex",
  height: "100vh",
  padding: 0,
});

function Navbar() {
  const [cookie, setCookie, removeCookie] = useCookies(["user_id"]);
  const navigate = useNavigate();
  return (
    <>
      <Container>
        <Sidebar>
          ini navigasi nnti ada home, pinned msg, profile, dsb
          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button
            onClick={() => {
              navigate("/login");
              removeCookie("user_id");
            }}
          >
            Logout
          </button>
        </Sidebar>
        <OutletWrapper>
          <Outlet />
        </OutletWrapper>
      </Container>
    </>
  );
}

export default Navbar;
