import { useEffect, useState } from "react";
import Profile from "../../assets/profile.jpg";

const FRIENDS_INFO_URL = "api-auth/dashboard/user-info/";
const ACTION_FRIENDS_URL = "api-auth/dashboard/make-request/";


import axios from "../../api/axios";

const AllFriends = ({ search }: { search: string }) => {
  const [friends, setFriends] = useState([]);

  // Getting friends
  const processFriends = async () => {
    try {
      const response: any = await axios.post(
        FRIENDS_INFO_URL,
        {},
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );

      const parsedResponse = JSON.parse(response.request.response);
      console.log(response);
      const { friends } = parsedResponse;
      setFriends(friends);
    } catch (err: any) {
      if (err.response?.status === 400) {
        console.log("Something went wrong");
      }
    }
  };

  useEffect(() => {
    processFriends();
  }, []);

  const removeFriend = async (friendName: string) => {
    try {
      const action = 4;
      const response = await axios.post(
        ACTION_FRIENDS_URL,
        JSON.stringify({ name: friendName, action: action }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(response);

      processFriends();
    } catch (err: any) {
      console.log(err.response);
      if (err.response?.status === 400) {
        console.log("Something went wrong");
      } else if (err.response?.status === 408) {
        console.log("You timed out!");
      } else if (err.response?.status === 404) {
        console.log("Friend not in list");
      } else {
        console.log("No Server Response");
      }
    }
  };


  // Searching friend 
  let searchFriends;

  if (search.length >= 1) {
    searchFriends = friends.filter((friend: any) =>
      friend.toLowerCase().startsWith(search.toLowerCase())
    );
  } else {
    searchFriends = friends;
  }

  return (
    <ul className="friend-list">
      {searchFriends.map((friend, index) => (
        <li key={index}>
          <img className="profile-pic" src={Profile} alt="" />
          <span className="friend-name">{friend}</span>
          <span
            className="material-symbols-outlined"
            onClick={() => removeFriend(friend)}
          >
            close
          </span>
        </li>
      ))}
    </ul>
  );
};
export default AllFriends;
