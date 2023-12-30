import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import axios from "axios";
import { useCookies } from "react-cookie";

interface ProfileData {
  name: string;
  phoneNumber: string;
  // Add other properties as needed
}

const Container = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
});

const PaperContainer = styled(Paper)({
  padding: "1rem",
  textAlign: "center",
});

const AvatarImage = styled(Avatar)({
  width: "10rem",
  height: "10rem",
  margin: "auto",
});

const EditProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState<string>("");
  const [cookie, setCookie] = useCookies(["user_id"]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(
          `http://localhost:3000/api/users/user-details/${cookie.user_id}`
        );
        setUserData(response.data);
        setEditedName(response.data.name);
        setEditedPhoneNumber(response.data.phoneNumber);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [cookie.user_id]);

  const handleSaveChanges = async () => {
    try {
      // Replace with your actual API endpoint
      await axios.put(
        `http://localhost:3000/api/users/update/${cookie.user_id}`,
        {
          name: editedName,
          phoneNumber: editedPhoneNumber,
          // Add other properties as needed
        }
      );

      // Optionally, you can update the local state with the edited data
      setUserData({
        ...userData,
        name: editedName,
        phoneNumber: editedPhoneNumber,
      });
    } catch (error) {
      console.error("Error updating user data", error);
    }
  };

  if (!userData) {
    // You can show a loading indicator while data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <PaperContainer elevation={10}>
        <AvatarImage
          alt="User Avatar"
          src="https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
        />
        <TextField
          label="Name"
          variant="outlined"
          margin="normal"
          fullWidth
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
        <TextField
          label="Phone Number"
          variant="outlined"
          margin="normal"
          fullWidth
          value={editedPhoneNumber}
          onChange={(e) => setEditedPhoneNumber(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </PaperContainer>
    </Container>
  );
};

export default EditProfilePage;
