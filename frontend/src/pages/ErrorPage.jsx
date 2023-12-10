import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  const nagivate = useNavigate()
  const status = error.status || 500; // Default to 500 if status is not available

  let message = "Oops! Something went wrong.";

  if (status === 404) {
    message = "Page not found.";
  } else if (status === 500) {
    message = "Internal Server Error.";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md">
        <h1 className="text-4xl font-bold mb-4">Error {status}</h1>
        <p className="text-lg">{message}</p>
        <a className="text-blue-700" style={{cursor:'pointer'}} onClick={() => nagivate(-1)}>Go back</a>
      </div>
    </div>
  );
}

export default ErrorPage;
