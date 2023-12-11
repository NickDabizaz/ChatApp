import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useLoaderData } from "react-router-dom";
import { useNavigate } from "react-router";

function ChatDashboard() {
    const [cookie, setCookie, removeCookie] = useCookies(["user_id"]);
    const navigate = useNavigate();
    const data = useLoaderData();
    console.log(data);
    

    // useEffect(() => {
    //     if(!cookie.user_id){
    //         navigate("/login")
    //     }
    // }, []);

    return (
        <div style={{ fontSize: "25pt" }}>ChatDashboard</div>
    )
}

export default ChatDashboard;
