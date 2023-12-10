import React from "react";
import { useLoaderData } from "react-router-dom";

function LoginPage() {
  const data = useLoaderData();
  console.log(data);
  return <div>LoginPage</div>;
}

export default LoginPage;
