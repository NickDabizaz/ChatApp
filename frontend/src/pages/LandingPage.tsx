import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>Welcome to ChatApp!</div>
        <div>a duplicate of WhatsApp</div>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </>
  );
}

export default LandingPage;
