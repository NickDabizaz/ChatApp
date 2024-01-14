import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import axios from "axios";

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  height: "100%",
  padding: "1rem",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
}));

const PaperContainer = styled(Paper)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.secondary.main,
}));

const AvatarImage = styled(Avatar)(({ theme }) => ({
  width: "7rem",
  height: "7rem",
  margin: "auto",
}));

function ProfilePage(props) {
  const curUserId = props.curUserId;
  const userData = props.userData;
  const setUserData = props.setUserData;
  const [profpic, setProfPic] = useState(props.userProfpic);
  const [editedName, setEditedName] = useState<string>(userData.name);
  const [editedPhoneNumber, setEditedPhoneNumber] = useState<string>(
    userData.phoneNumber
  );
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/users/pic/${curUserId}`)
      .then((res) => {
        setProfPic(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [selectedFile]);

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
        alert("Profile picture berhasil diubah");
      }
      const response = await axios.post(
        `http://localhost:3000/api/users/profilpic/${curUserId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await axios.put(
        `http://localhost:3000/api/users/edit-profile/${curUserId}`,
        {
          name: editedName,
          phoneNumber: editedPhoneNumber,
          // Add other properties as needed
        }
      );

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
    return <div>Loading...</div>;
  }

  return (
    <Container>
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
                  ? `http://localhost:3000/api/users/pic/${curUserId}`
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
        disabled={true}
      />
      <Button variant="contained" color="primary" onClick={handleSaveChanges}>
        Save Changes
      </Button>
    </Container>
  );
}

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
    fileInputRef.current.click();
  };

  const displayImage = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
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

        document.getElementById("imageContainer").innerHTML = "";
        document.getElementById("imageContainer").appendChild(imgElement);
      };

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

export default ProfilePage;
