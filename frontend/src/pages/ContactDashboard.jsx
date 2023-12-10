import React from "react";
import { useLoaderData } from "react-router-dom";
import ContactCard from "../Components/ContactCard";

function ContactDashboard() {
  const data = useLoaderData();
  console.log(data);
  const users = data
  return (
    <>
      <div className="mx-4 mt-3" style={{ fontSize: "25pt" }}>ContactDashboard</div>
      <div className="row mx-2" >
        {
          users.map((user, index) => {
            return <ContactCard key={index} user={user} />
          })
        }
      </div>
    </>
  )
}

export default ContactDashboard;
