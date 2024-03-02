// LIBRARIES
import React from "react";
import { Link as LinkScroll } from "react-scroll";

// IMAGES
import Menu from "../../assets/Menu.png";
import Logo from "../../assets/NinjaHead.png";

export const Navbar = ({ toggleModal }: { toggleModal: () => void }) => {
  return (
    <React.Fragment>
      <nav className="navbar fixed-top navbar-expand-lg">
        <div className="container">
          <img className="navbar-logo" src={Logo} alt="" />
          <a className="navbar-brand" href="#">
            LowkeySpots
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarOpen"
          >
            <img className="navbar-toggle-image" src={Menu} alt="" />
          </button>

          <div className="collapse navbar-collapse" id="navbarOpen">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <LinkScroll
                  to="home"
                  smooth={true}
                  duration={100}
                  className="nav-link"
                >
                  Home
                </LinkScroll>
              </li>
              <li className="nav-item">
                <LinkScroll
                  to="section-2"
                  smooth={true}
                  duration={100}
                  offset={-200}
                  className="nav-link"
                >
                  About
                </LinkScroll>
              </li>
              <li className="nav-item">
                <LinkScroll
                  to="section-3"
                  smooth={true}
                  duration={100}
                  className="nav-link"
                >
                  Contact
                </LinkScroll>
              </li>
              <li className="nav-item">
                <LinkScroll
                  to="home"
                  className="nav-link nav-link-button"
                  onClick={toggleModal}
                >
                  Login
                </LinkScroll>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};
export default Navbar;
