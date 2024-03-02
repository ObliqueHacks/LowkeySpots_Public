// LIBRARIES
import axios from "../../api/axios";
import { useContext, useEffect } from "react";

// ASSETS
import Profile from "../../assets/profile.jpg";

// COMPONENTS
import AuthContext from "../../context/AuthProvider.tsx";
const GET_USER_URL = "api-auth/dashboard/user-info/";

const Topbar = () => {
  const { auth, setAuth }: any = useContext(AuthContext);
  const { user } = auth;

  useEffect(() => {
    const getUser = async () => {
      try {
        const response: any = await axios.post(
          GET_USER_URL,
          {},
          {
            headers: { "Content-type": "application/json" },
            withCredentials: true,
          }
        );

        const parsedResponse = JSON.parse(response.request.response);
        const { name } = parsedResponse;
        setAuth({ user: name });
      } catch (err: any) {
        if (err.response?.status === 400) {
          console.log("Something went wrong");
        }
      }
    };
    getUser();
  }, []);

  return (
    <div className="topbar">
      {" "}
      {/* <span className="material-symbols-outlined">notifications</span>{" "}
      <span className="material-symbols-outlined">settings</span>{" "} */}
      <h6>{user}</h6> <img src={Profile} alt="" />
    </div>
  );
};
export default Topbar;
