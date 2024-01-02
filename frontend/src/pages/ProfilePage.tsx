import React, { useEffect, useState, useRef } from "react";
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
  width: "20rem",
  maxWidth: "20rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  backgroundColor: "red",
});

const PaperContainer = styled(Paper)({
  height: "100%",
  padding: "1rem",
  textAlign: "center",
  backgroundColor: "yellow",
});

const AvatarImage = styled(Avatar)({
  width: "7rem",
  height: "7rem",
  margin: "auto",
});

const EditProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState<string>("");
  const [cookie, setCookie] = useCookies(["user_id"]);
  const [profpic, setProfPic] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/users/pic/${cookie.user_id}`)
      .then((res) => {
        setProfPic(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [selectedFile]);

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
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      const response = await axios.post(
        `http://localhost:3000/api/users/profilpic/${cookie.user_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
      <PaperContainer>
        <div
          className="mx-auto"
          style={{
            width: "100%",
            height: "50%",
            objectFit: "cover",
            display: "flex",
          }}
        >
          <div
            className=" text-center"
            style={{ display: "block", width: "100%" }}
          >
            {selectedFile ? (
              <div id="imageContainer"></div>
            ) : (
              <AvatarImage
                alt="User Avatar"
                src={
                  profpic
                    ? `http://localhost:3000/api/users/pic/${cookie.user_id}`
                    : "https://i.pinimg.com/736x/38/47/9c/38479c637a4ef9c5ced95ca66ffa2f41.jpg"
                }
              />
            )}
            <div className="mx-auto mt-3">
              <button className="mx-auto btn btn-secondary">
                <FileUploader setSelectedFile={setSelectedFile} />
              </button>
            </div>
            <br />
            <div className="mx-auto">
              File size: maximum 1 MB <br />
              File extension: .JPEG, .PNG
            </div>
          </div>
        </div>

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

const FileUploader = ({ setSelectedFile }) => {
  const [tempFile, setTempFile] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setTempFile(file);
    displayImage(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    setTempFile(file);
    displayImage(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    // Trigger the file input when the drop zone is clicked
    fileInputRef.current.click();
  };

  const displayImage = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Create an image element and set the data URL as its source
        const imgElement = document.createElement("img");
        imgElement.src = e.target.result;
        imgElement.alt = "Selected Image";

        imgElement.style.marginLeft = "auto";
        imgElement.style.marginRight = "auto";
        imgElement.style.height = "10rem";
        imgElement.style.width = "10rem";
        imgElement.style.objectFit = "cover";
        imgElement.style.borderRadius = "50%";
        imgElement.style.border = "1px solid black";

        // Append the image element to the component
        document.getElementById("imageContainer").innerHTML = "";
        document.getElementById("imageContainer").appendChild(imgElement);
      };

      // Use readAsDataURL for images
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
        ref={fileInputRef}
        accept=".jpeg, .jpg, .png"
      />
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          textAlign: "center",
          cursor: "pointer",
          height: "auto",
        }}
      >
        <p>Select Image</p>
      </div>
    </div>
  );
};

export default EditProfilePage;
