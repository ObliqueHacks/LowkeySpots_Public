import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../api/axios";

const REGISTER_URL = "api-auth/homepage/register/";

const Register = ({
  toggleModal,
  toggleLogin,
}: {
  toggleModal: () => void;
  toggleLogin: () => void;
}) => {
  // Validates Username -> Must Start with Lower/Upper case letter and can then be followed by anything arrangement of letters, numbers, - or _. No other special characters. Between 3-24 characters
  const USER_REGEX = /^[a-zA-z][a-zA-Z0-9-_]{3,23}$/;

  // Validates Password -> Requires at least one lower case letter, one uppercase letter, one digit, and one special character, and between 8-24 characters
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

  const userRef: any = useRef();
  const errRef: any = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setUser("");
    setPwd("");
    setMatchPwd("");
  };

  const closeBtn = () => {
    toggleModal();
    resetForm();
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          name: user,
          psswd: pwd,
        }),
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      console.log(JSON.stringify(response));
      setSuccess(true);
      resetForm();
    } catch (err: any) {
      console.log(err.response);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (
        err.response?.status === 400 &&
        err.response?.data?.user === "Username taken"
      ) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Signup Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section className="signup-section">
      <button onClick={closeBtn} className="close-modal-btn" tabIndex={-1}>
        &times;
      </button>
      <h3 onClick={toggleLogin} tabIndex={-1}>
        Signup
      </h3>
      <div className="social-buttons">
        <button>
          <i className="bx bxl-google"></i>Use Google
        </button>
      </div>

      <div className="separator">
        <div className="line"></div>
        <p>Or</p>
        <div className="line"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="usernameSignup" className="form-label">
          <span className={validName ? "valid" : "hidden"}>
            <FontAwesomeIcon className="checkmark" icon={faCheck} />
          </span>
          <span className={validName || !user ? "hidden" : "invalid"}>
            <FontAwesomeIcon className="times" icon={faTimes} />
          </span>
        </label>
        <input
          type="username"
          className="form-control"
          id="usernameSignup"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          aria-invalid={validName ? "false" : "true"}
          aria-describedby="uidnote"
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
          placeholder="Username"
          required
        />
        <p
          id="uidnote"
          className={
            userFocus && user && !validName ? "signup-ins" : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters. <br />
          Must begin with a letter. <br />
          Letters, numbers, underscores, hyphens allowed.
        </p>
        <label htmlFor="pwdSignup" className="form-label">
          <span className={validPwd ? "valid" : "hidden"}>
            <FontAwesomeIcon className="checkmark" icon={faCheck} />
          </span>
          <span className={validPwd || !pwd ? "hidden" : "invalid"}>
            <FontAwesomeIcon className="times" icon={faTimes} />
          </span>
        </label>
        <input
          type="password"
          className="form-control"
          id="pwdSignup"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          aria-invalid={validPwd ? "false" : "true"}
          aria-describedby="pwdnote"
          placeholder="Password"
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
          required
        />
        <p
          id="pwdnote"
          className={pwdFocus && !validPwd ? "signup-ins" : "offscreen"}
        >
          <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters. <br />
          Must include uppercase and lowercase letters, a number and a special
          character.
        </p>

        <label htmlFor="passwordSignupMatch" className="form-label">
          <span className={validMatch && matchPwd ? "valid" : "hidden"}>
            <FontAwesomeIcon className="checkmark" icon={faCheck} />
          </span>
          <span className={validMatch || !matchPwd ? "hidden" : "invalid"}>
            <FontAwesomeIcon className="times" icon={faTimes} />
          </span>
        </label>
        <input
          type="password"
          className="form-control"
          id="passwordSignupMatch"
          onChange={(e) => setMatchPwd(e.target.value)}
          value={matchPwd}
          aria-invalid={validMatch ? "false" : "true"}
          aria-describedby="pwdmatchnote"
          placeholder="Retype Password"
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
          required
        />
        <p
          id="pwdmatchnote"
          className={matchFocus && !validMatch ? "signup-ins" : "offscreen"}
        >
          <FontAwesomeIcon icon={faInfoCircle} /> Invalid Match. <br />
        </p>

        <button
          disabled={!validName || !validPwd || !validMatch ? true : false}
          type="submit"
          className="modal-btn"
          tabIndex={-1}
        >
          {"Signup"}
        </button>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <p className={success ? "success" : "offscreen"} aria-live="assertive">
          Congratulations! You are registered. Please refresh and go to login.
        </p>
      </form>
    </section>
  );
};
export default Register;
