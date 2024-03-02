/* LIBRARIES */

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios.ts";
import Cookies from "js-cookie";

// IMAGES
import Logo from "../../assets/NinjaHead.png";

// COMPONENTS
import Markerbar from "../../components/map/Markerbar.tsx";

// API URLS
const FRIENDS_INFO_URL = "api-auth/dashboard/user-info/"; // Getting User Info

const Sidebar = ({
  editMap = false,
  map,
}: {
  editMap?: boolean;
  map?: any;
}) => {
  const location = useLocation();
  let navigate = useNavigate();

  const [mapActive, setMapActive] = useState(
    location.pathname === "/dashboard"
  );
  const [friendsActive, setFriendsActive] = useState(
    location.pathname === "/friends"
  );

  const [nbRequest, setNbRequest] = useState();

  useEffect(() => {
    const processFriendRequests = async () => {
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

        const { incomingRequests } = parsedResponse;

        setNbRequest(incomingRequests.length);
      } catch (err: any) {
        console.log(err.response);
        if (err.response?.status === 400) {
          console.log("Something went wrong");
        }
      }
    };

    processFriendRequests();
  }, []);

  const handleMapLink = () => {
    setMapActive(true);
    setFriendsActive(false);
  };

  const handleFriendLink = () => {
    setFriendsActive(true);
    setMapActive(false);
  };

  return (
    <aside>
      <div className="toggle">
        <div className="sidebar-logo">
          <img src={Logo} alt="" />
          <h3>LowkeySpots</h3>
        </div>
        <div className="close" id="sidebar-close">
          <span className="material-symbols-outlined">menu</span>
        </div>
      </div>

      <div className="sidebar">
        <Link
          to="/dashboard"
          className={mapActive ? "sidebar-item active" : "sidebar-item"}
          onClick={handleMapLink}
        >
          <span className="material-symbols-outlined">map</span>
          <h4 className="display-6" id="dashboard-display">
            Maps
          </h4>
        </Link>
        <Link
          to="/friends"
          className={friendsActive ? "sidebar-item active" : "sidebar-item"}
          onClick={handleFriendLink}
        >
          <span className="material-symbols-outlined">group_add</span>
          <h4 className="display-6" id="dashboard-display">
            Friends
          </h4>
          <span className="friend-requests">{nbRequest}</span>
        </Link>
        <li className="sidebar-item">
          <span className="material-symbols-outlined">logout</span>
          <h4
            className="display-6"
            id="dashboard-display"
            onClick={() => {
              Cookies.remove("genToken");
              navigate("/");
            }}
          >
            Logout
          </h4>
        </li>
      </div>
      {editMap && <Markerbar map={map}></Markerbar>}
    </aside>
  );
};
export default Sidebar;
