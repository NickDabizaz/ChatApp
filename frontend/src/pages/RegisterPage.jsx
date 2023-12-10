import React from "react";
import { useLoaderData } from "react-router-dom";

function RegisterPage() {
  const data = useLoaderData();
  console.log(data);
  return (
    <div>RegisterPage</div>
  )
}

export default RegisterPage;
