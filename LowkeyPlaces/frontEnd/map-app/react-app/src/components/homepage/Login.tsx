import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider.tsx";
import axios from "../../api/axios.ts";
import Cookies from "js-cookie";

const LOGIN_URL = "api-auth/homepage/login/";

export const Login = ({ toggleLogin }: { toggleLogin: () => void }) => {
  const userRef: any = useRef();
  const errRef: any = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const { setAuth }: any = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response: any = await axios.post(
        LOGIN_URL,
        JSON.stringify({ name: user, psswd: pwd }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.genToken;
      Cookies.set("genToken", accessToken, { expires: 7 });
      setUser("");
      setPwd("");
      setAuth(user);
      navigate("/dashboard");
    } catch (err: any) {
      console.log(err.response);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Invalid Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section className="login-section">
      <h3 onClick={toggleLogin} tabIndex={-1}>
        Login
      </h3>
      <div className="social-buttons">
        <button tabIndex={-1}>
          <i className="bx bxl-google"></i>Use Google
        </button>
      </div>

      <div className="separator">
        <div className="line"></div>
        <p>Or</p>
        <div className="line"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="usernameLogin" className="form-label"></label>
        <input
          type="text"
          className="form-control"
          ref={userRef}
          autoComplete="off"
          id="usernameLogin"
          placeholder="Username"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          tabIndex={-1}
          required
        />
        <label htmlFor="passwordLogin" className="form-label"></label>
        <input
          type="password"
          className="form-control"
          id="passwordLogin"
          ref={userRef}
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          aria-describedby="passwordHez lpBlock"
          placeholder="Password"
          tabIndex={-1}
          required
        />
        <button type="submit" className="modal-btn" tabIndex={-1}>
          Login
        </button>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
      </form>
    </section>
  );
};
export default Login;
