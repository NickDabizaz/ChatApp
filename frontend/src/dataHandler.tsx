import axios from "axios";
import { Socket, io } from "socket.io-client";

// Create a socket instance
// const socket: Socket = io("http://localhost:3000"); // Replace with the actual server URL

// Function to fetch user data using Axios
const loadData = async (): Promise<any> => {
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

const loadCurUser = async (): Promise<any> => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/users/user-details/"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export default { loadData };
