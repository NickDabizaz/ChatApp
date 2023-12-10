import React from "react";
import { useLoaderData } from "react-router-dom";

function ContactDashboard() {
  const data = useLoaderData();
  console.log(data);
  return (
    <div>ContactDashboard</div>
  )
}

export default ContactDashboard;
