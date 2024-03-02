// LIBRARIES
import React from "react";
import { useState } from "react";

// COMPONENTS
import Register from "../../components/homepage/Register.tsx";
import Login from "../../components/homepage/Login.tsx";

export const Modal = ({
  modalActive,
  toggleModal,
}: {
  modalActive: boolean;
  toggleModal: () => void;
}) => {
  const [loginActive, setLogin] = useState(true);

  const toggleLogin = () => {
    setLogin(!loginActive);
  };

  return (
    <React.Fragment>
      <div
        className={modalActive ? "modal-box" : "modal-box inactive"}
        id="login"
      >
        <div
          className={loginActive ? "modal-container active" : "modal-container"}
        >
          <Register
            toggleModal={toggleModal}
            toggleLogin={toggleLogin}
          ></Register>
          <Login toggleLogin={toggleLogin}></Login>
        </div>
      </div>
      <div
        onClick={toggleModal}
        className={modalActive ? "overlay" : "overlay hidden"}
      ></div>
    </React.Fragment>
  );
};
export default Modal;
