import React from "react";
import Box from "@mui/system/Box";
import { styled } from "@mui/system";
import { Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

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
  const navigate = useNavigate();
  return (
    <>
      <Container>
        <SubContainer>
          <Sidebar>
            {/* ini navigasi nnti ada home, pinned msg, profile, dsb */}
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
            <button>Setting</button>
          </Sidebar>
          <OutletWrapper>
            <Outlet />
          </OutletWrapper>
        </SubContainer>
      </Container>
    </>
  );
}

export default Navbar;
