import { useState } from "react";

/* COMPONENTS */
import Sidebar from "../global/Sidebar";
import AllFriends from "../../components/friends/AllFriends.tsx";
import Pending from "../../components/friends/Pending.tsx";
import Topbar from "../global/Topbar.tsx";
import axios from "../../api/axios";

/* LIBRARIES */
import { ToastContainer, toast } from "react-toastify";
import { Fade } from "react-awesome-reveal";

/* API URLS */
const ADD_FRIENDS_URL = "api-auth/dashboard/make-request/";

const Friends = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const resetFields = () => {
    setSearch("");
  };

  const handleCatgeory = (cat: string) => {
    switch (cat) {
      case "all":
        setCategory("All");
        break;
      case "pending":
        setCategory("Pending");
        break;
      case "blocked":
        setCategory("Blocked");
        break;
      case "addfriend":
        setCategory("Add Friend");
        break;
    }
    resetFields();
  };

  const handleFriendRequest = async (e: any, search: string) => {
    e.preventDefault();
    const action = 0; // Sending a friend request
    try {
      const response: any = await axios.post(
        ADD_FRIENDS_URL,
        JSON.stringify({
          name: search,
          action,
        }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success("Friend Request Was Sent!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      resetFields();
    } catch (err: any) {
      if (err.response?.status === 400) {
        toast.error("Something went wrong! Please logout and login.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (err.response?.status === 408) {
        toast.error("You timed out! Please login again.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (err.response?.status === 404) {
        toast.error("Username Doesn't exist!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (err.response?.status === 409) {
        toast.error("Already Friends!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (err.response?.status === 422) {
        toast.error("Request Already Sent!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error("No Server Response", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      resetFields();
    }
  };

  return (
    <div className="container">
      <Sidebar></Sidebar>
      <Fade>
        <div className="friends">
          <Topbar></Topbar>
          <h1 className="fheader">Friends</h1>

          <div className="friends-bar">
            <span
              className="friends-item"
              onClick={() => handleCatgeory("all")}
            >
              All
            </span>
            <span
              className="friends-item"
              onClick={() => handleCatgeory("pending")}
            >
              Pending
            </span>
            <span
              className="friends-item"
              onClick={() => handleCatgeory("blocked")}
            >
              Blocked
            </span>
            <span
              className="friends-item"
              onClick={() => handleCatgeory("addfriend")}
            >
              Add Friend
            </span>
          </div>
          <div className="friends-info">
            {category !== "Add Friend" ? (
              <div className="search">
                <input
                  type="search"
                  name="search"
                  placeholder=" Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <span className="material-symbols-outlined">search</span>
              </div>
            ) : (
              <div className="search">
                <input
                  type="search"
                  name="search"
                  placeholder=" Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="send-friend-request"
                  onClick={(e) => handleFriendRequest(e, search)}
                >
                  Send Friend Request
                </button>
                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                />
              </div>
            )}
            <p>{`${category}`}</p>
            {category === "All" && <AllFriends search={search}></AllFriends>}
            {category === "Pending" && <Pending search={search}></Pending>}
          </div>
        </div>
      </Fade>
    </div>
  );
};
export default Friends;
