import axios from "axios";
import io from "socket.io-client";

// Create a socket instance
const socket = io("http://localhost:5173"); // Replace with the actual server URL

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

export default { loadData };
