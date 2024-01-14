import axios from "axios";
import { Socket, io } from "socket.io-client";

// Create a socket instance
// const socket: Socket = io("https://chat-app-api-qam0.onrender.com"); // Replace with the actual server URL

// Function to fetch user data using Axios
const loadData = async (): Promise<any> => {
  try {
    const response = await axios.get(
      "https://chat-app-api-qam0.onrender.com/api/users/all-users"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

const loadCurUser = async (): Promise<any> => {
  try {
    const response = await axios.get(
      "https://chat-app-api-qam0.onrender.com/api/users/user-details/"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export default { loadData };
