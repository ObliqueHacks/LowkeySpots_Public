import { useEffect, useState } from "react";
import Profile from "../../assets/profile.jpg";

const MAP_USERS_URL = "api-auth/map/get-users/";
const ADD_FRIEND_TO_MAP_URL = "api-auth/map/add-friend/";
const EDIT_PERMS_URL = "api-auth/map/edit-perms/";
const FRIENDS_INFO_URL = "api-auth/dashboard/user-info/";

import axios from "../../api/axios";

const MapFriends = ({
  mapId,
  addFriend,
  userStatus,
}: {
  mapId: number;
  addFriend: boolean;
  userStatus?: number;
}) => {
  const [mapFriends, setMapFriends]: any = useState({});
  const [allFriends, setAllFriends]: any = useState([]);

  const processMapFriends = async (mapId: number) => {
    try {
      const response: any = await axios.post(
        MAP_USERS_URL,
        JSON.stringify({ mapId: mapId }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );
      setMapFriends(response.data);
    } catch (err: any) {
      if (err.response?.status === 400) {
        console.log("Something went wrong");
      }
    }
  };

  useEffect(() => {
    processMapFriends(mapId);
  }, []);

  useEffect(() => {
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
        const { friends } = parsedResponse;
        setAllFriends(friends);
        setAllFriends((prevFriends: any) =>
          prevFriends.filter((friend: string) => !(friend in mapFriends))
        );
      } catch (err: any) {
        if (err.response?.status === 400) {
          console.log("Something went wrong");
        }
      }
    };

    processFriends();
  }, [mapFriends]);

  const addCollabtoMap = async (recId: string, mapId: number) => {
    const status = 1; // Collab

    try {
      const response: any = await axios.post(
        ADD_FRIEND_TO_MAP_URL,
        JSON.stringify({
          recId: recId,
          mapId: mapId,
          reqType: status,
        }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );

      processMapFriends(mapId);
      console.log(response);
      
    } catch (err: any) {
      console.log(err.response);
      if (err.response?.status === 400) {
        console.log(
          "Cannot add admins or the friend is already part of the map"
        );
      } else if (err?.response?.status === 408) {
        console.log("Invalid Token");
      } else if (err?.response?.status === 427) {
        console.log("Invalid Permission");
      }
    }
  };

  const addSpectoMap = async (recId: string, mapId: number) => {
    const status = 2;

    try {
      const response: any = await axios.post(
        ADD_FRIEND_TO_MAP_URL,
        JSON.stringify({
          recId: recId,
          mapId: mapId,
          reqType: status,
        }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );
      processMapFriends(mapId);
      console.log(response);
    } catch (err: any) {
      if (err.response?.status === 400) {
        console.log(
          "Cannot add admins or the friend is already part of the map"
        );
      } else if (err.response?.status === 427) {
        console.log("Invalid Permission");
      }
    }
  };

  const removeFriendFromMap = async (recId: string, mapId: number) => {
    try {
      const response: any = await axios.post(
        EDIT_PERMS_URL,
        JSON.stringify({
          recId: recId,
          mapId: mapId,
        }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );
      processMapFriends(mapId);
      console.log(response);
    } catch (err: any) {
      if (err.response?.status === 400) {
        console.log(
          "Cannot add admins or the friend is already part of the map"
        );
      } else if (err.response?.status === 427) {
        console.log("Invalid Permission");
      }
    }
  };

  return addFriend ? (
    <ul className="friend-list">
      {allFriends.map((friend: string, index: number) => (
        <li key={index}>
          <img className="profile-pic" src={Profile} alt="" />
          <span className="friend-name">{friend}</span>
          <div className="add-map-friend-symbols">
            <span
              className="material-symbols-outlined"
              onClick={() => addSpectoMap(friend, mapId)}
            >
              visibility
            </span>

            <span
              className="material-symbols-outlined"
              onClick={() => addCollabtoMap(friend, mapId)}
            >
              person_add
            </span>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <ul className="friend-list">
      {Object.entries(mapFriends).map(([friend, status]: any, index: any) => (
        <li key={index}>
          <img className="profile-pic" src={Profile} alt="" />
          <span className="friend-name">{friend}</span>
          <span className="status">
            {status === 0
              ? "Admin"
              : status === 1
              ? "Collaborator "
              : "Spectator"}
          </span>

          {userStatus === 0 && status === 1 && (
            <span
              className="material-symbols-outlined"
              onClick={() => removeFriendFromMap(friend, mapId)}
            >
              visibility
            </span>
          )}
          {userStatus === 0 && status === 2 && (
            <span
              className="material-symbols-outlined"
              onClick={() => removeFriendFromMap(friend, mapId)}
            >
              close
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};
export default MapFriends;
