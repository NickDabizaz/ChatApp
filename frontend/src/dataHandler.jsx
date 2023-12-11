import axios from "axios";
import { redirect } from "react-router-dom";
import io from "socket.io-client";
import Swal from "sweetalert2"

// Create a socket instance
const socket = io("http://localhost:5173"); // Replace with the actual server URL
const host = "http://localhost:3000";

// Function to fetch user data using Axios
const loadData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/users/all-users"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

const login = async (data) => {
  if (data.request.method == "POST") {
    try {
      const formData = await data.request.formData()
      const newItem = Object.fromEntries(formData);
      await axios.post(`${host}/api/users/login`, newItem);
      return redirect("/");
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password salah!',
      });
      return redirect("/login");
    }

  }
}

export default { loadData, login };
