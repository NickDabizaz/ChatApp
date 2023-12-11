import React from "react";
import { useLoaderData } from "react-router-dom";

function ProfileDashboard() {
  const data = useLoaderData();
  console.log(data);
  return <div></div>;
}

export default ProfileDashboard;
