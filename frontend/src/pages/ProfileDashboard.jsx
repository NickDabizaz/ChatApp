import React from "react";
import { useLoaderData } from "react-router-dom";

function ProfileDashboard() {
  const data = useLoaderData();
  console.log(data);
  return (
    <div>ProfileDashboard</div>
  )
}

export default ProfileDashboard;