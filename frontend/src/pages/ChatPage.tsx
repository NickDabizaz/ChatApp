import { Avatar } from "@mui/material";
import { Box, Container, styled } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

const FriendImage = styled(Avatar)({
  width: "5rem",
  height: "5rem",
  //   margin: "auto",
});

const FriendDetailContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
});

function ChatPage() {
  const [cookie] = useCookies();
  const { friendId } = useParams();
  const [curUser, setCurUser] = useState(null);
  const [curFriend, setCurFriend] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/users/user-details/${cookie.user_id}`
        );
        setCurUser(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or error
      }
    };

    const fetchCurFriend = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/users/user-details/${friendId}`
        );
        setCurFriend(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or error
      }
    };

    fetchCurUser();
    fetchCurFriend();
    console.log(curUser);
    console.log(curFriend);
  }, [friendId]);

  if (loading) return <div>loading...</div>;

  return (
    <>
      <Container>
        <FriendDetailContainer>
          {curFriend ? (
            <>
              <FriendImage
                alt="User Avatar"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE1gis2dLLKJ_dBWVyf4j1fJ3tDvKzO2g7yQ&usqp=CAU"
              />
              {curFriend.name}
            </>
          ) : (
            "loading"
          )}
        </FriendDetailContainer>
        <div style={{ width: "100%", height: "auto", backgroundColor: "red" }}>
          {curUser && curFriend ? (
            <div
              style={{ width: "100%", height: "100%", backgroundColor: "red" }}
            >
              from {curUser.name} to {curFriend.name}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </Container>
    </>
  );
}

export default ChatPage;
