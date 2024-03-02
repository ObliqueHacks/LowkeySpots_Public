// LIBRARIES
import React, { useState } from "react";
import { Link as LinkScroll } from "react-scroll";
import { Fade } from "react-awesome-reveal";
import Cookies from "js-cookie";

// IMAGES
import MapIcon from "../../assets/Map.png";
import FriendsIcon from "../../assets/friends.png";
import PhotoIcon from "../../assets/Gallery.png";
import MapImg from "../../assets/interactivemap.jpg";
import FriendImg from "../../assets/friendsimg.jpg";
import GalleryImg from "../../assets/Galleryimg.png";
import DistractionsIcon from "../../assets/Broom.png";
import EasyIcon from "../../assets/Easy.png";
import LowkeyIcon from "../../assets/Secret.png";

// PAGES
import Modal from "./LoginModal.tsx";
import Navbar from "./Navbar.tsx";

// COMPONENTS
import LinkBar from "../../components/homepage/LinkBar.tsx";

function HomePage() {
  const [modalActive, setModal] = useState(false);
  const [tabOneActive, setTabOne] = useState(true);
  const [tabTwoActive, setTabTwo] = useState(false);
  const [tabThreeActive, setTabThree] = useState(false);

  Cookies.remove("genToken");

  const toggleModal = () => {
    setModal(!modalActive);
  };

  const handleTab = (tab: Number) => {
    if (tab === 1) {
      setTabOne(true);
      setTabTwo(false);
      setTabThree(false);
    } else if (tab === 2) {
      setTabOne(false);
      setTabTwo(true);
      setTabThree(false);
    } else if (tab === 3) {
      setTabOne(false);
      setTabTwo(false);
      setTabThree(true);
    }
  };

  return (
    <React.Fragment>
      <div className="header" id="home">
        <Navbar toggleModal={toggleModal}></Navbar>
        <div className="header_title">
          <Fade triggerOnce={true} delay={100}>
            <h1>
              Discover
              <span className="highlight"> hidden </span>
              routes <br />
              Map your
              <span className="highlight"> secrets </span>
            </h1>
          </Fade>
          <Fade triggerOnce={true} delay={100}>
            <br />
            <h5>A social platform for adventures</h5>
            <br />
            <LinkScroll
              to="features"
              smooth={true}
              offset={-500}
              duration={100}
              className="btn-text btn-scroll-to"
            >
              Learn more &darr;
            </LinkScroll>
          </Fade>
        </div>
        <img src="" alt="" />
      </div>

      <section className="section" id="section-1">
        <Fade delay={50} direction="up" triggerOnce>
          <div className="section-title">
            <h1 className="display-6">Features</h1>
            <h4>Share your favourite spots in secrecy!</h4>
          </div>
        </Fade>

        <div className="features" id="features">
          <div className="feature-info">
            <Fade triggerOnce>
              <div className="feature-icons">
                <img src={MapIcon} alt="" />
              </div>
              <h6 className="features-header">Interactive Map</h6>
              <p className="info">
                Lowkey Spots offers an Interactive Map feature that turns your
                adventures into an immersive experience. Pinpoint your favorite
                spots, trace your journey, and share the thrill with friends and
                family. It's not just about where you've been; it's about
                reliving the excitement through a visual map that tells the
                story of your adventures.
              </p>
            </Fade>
          </div>

          <Fade triggerOnce>
            <img className="feature-image" src={MapImg} alt="" />
          </Fade>

          <Fade triggerOnce>
            <img className="feature-image-2" src={FriendImg} alt="" />
          </Fade>

          <div className="feature-info">
            <Fade triggerOnce>
              <div className="feature-icons-2">
                <img src={FriendsIcon} alt="" />
              </div>
              <h6 className="features-header">Add Friends</h6>
              <p>
                Adding friends has never been easier with Lowkey Spots. Connect
                with fellow explorers, build a community, and embark on new
                adventures together. Whether it's planning a weekend hike or a
                cross-country road trip, the Add Friends feature ensures that
                your circle is always in the loop, ready for the next thrilling
                escapade.
                <img src="" alt="" />
              </p>
            </Fade>
          </div>

          <div className="feature-info">
            <Fade triggerOnce>
              <div className="feature-icons-3">
                <img src={PhotoIcon} alt="" />
              </div>
              <h6 className="features-header">Upload Photos</h6>
              <p>
                Capture the essence of your journeys with the Upload Photos
                feature on Lowkey Spots. From breathtaking landscapes to candid
                moments with friends, preserve the memories that make your
                adventures unforgettable. Share the beauty of your experiences
                visually, turning every photo into a story waiting to be
                explored by your network of fellow adventure enthusiasts.
                <img src="" alt="" />
              </p>
            </Fade>
          </div>

          <Fade triggerOnce>
            <img className="feature-image-3" src={GalleryImg} alt="" />
          </Fade>
        </div>
      </section>

      <section className="section" id="section-2">
        <Fade delay={50} direction="up" triggerOnce>
          <div className="section-title">
            <h1 className="display-6" id="aboutdisplay">
              About
            </h1>
            <h4>What is the aim?</h4>
          </div>
        </Fade>

        <Fade delay={50} direction="up" triggerOnce>
          <div className="about">
            <div className="about-tab-container">
              <button
                onClick={() => handleTab(1)}
                className={
                  tabOneActive
                    ? "btn about-tab about-tab--1 about-tab--active"
                    : "btn about-tab about-tab--1"
                }
                data-tab="1"
              >
                <span>01</span>Distraction-Free
              </button>
              <button
                onClick={() => handleTab(2)}
                className={
                  tabTwoActive
                    ? "btn about-tab about-tab--2 about-tab--active"
                    : "btn about-tab about-tab--2"
                }
                data-tab="2"
              >
                <span>02</span>Easy to use
              </button>
              <button
                onClick={() => handleTab(3)}
                className={
                  tabThreeActive
                    ? "btn about-tab about-tab--3 about-tab--active"
                    : "btn about-tab about-tab--3"
                }
                data-tab="3"
              >
                <span>03</span>Lowkey
              </button>
            </div>
            <div
              className={
                tabOneActive
                  ? "about-content about-content--1 about-content--active"
                  : "about-content about-content--1"
              }
            >
              <div className="about-icon about-icon--1">
                <img src={DistractionsIcon} alt="" />
              </div>
              <h5 className="about-header">
                No distractions. Perfect for minimalists and for saving time!
              </h5>
              <p>
                Lowkey Spots provides a distraction-free platform, making it a
                haven for minimalists and those seeking to save time. With a
                clean interface and focused features, users can seamlessly
                navigate and share their adventures without the clutter of
                unnecessary distractions. It's the perfect space for individuals
                who value simplicity and efficiency in their social sharing
                experience.
              </p>
            </div>

            <div
              className={
                tabTwoActive
                  ? "about-content about-content--2 about-content--active"
                  : "about-content about-content--2"
              }
            >
              <div className="about-icon about-icon--2">
                <img src={EasyIcon} alt="" />
              </div>
              <h5 className="about-header">
                User-Friendly dashboard with simple features!
              </h5>
              <p>
                The user-friendly dashboard of Lowkey Spots ensures that even
                those new to the platform can easily navigate its features. With
                simplicity at its core, the intuitive design allows users to
                effortlessly create and share their journey maps, connect with
                friends, and upload photos. The emphasis on ease of use makes
                Lowkey Spots accessible to everyone, regardless of their
                tech-savviness, making it a hassle-free experience for all.
              </p>
            </div>
            <div
              className={
                tabThreeActive
                  ? "about-content about-content--3 about-content--active"
                  : "about-content about-content--3"
              }
            >
              <div className="about-icon about-icon--3">
                <img src={LowkeyIcon} alt="" />
              </div>
              <h5 className="about-header">
                Ideal for friends and family. Share your memories in style!
              </h5>
              <p>
                Lowkey Spots lives up to its name, providing an ideal platform
                for friends and family to share memories in a more intimate and
                personalized manner. Whether it's a hidden gem discovered during
                a road trip or a quiet moment captured on a hike, Lowkey Spots
                allows users to curate and share their experiences with a select
                audience. It adds a touch of exclusivity and charm to the social
                sharing experience, making it a unique and stylish way to
                connect with loved ones
              </p>
            </div>
          </div>
        </Fade>
      </section>

      <section className="section" id="section-3">
        <Fade delay={50} direction="up" triggerOnce>
          <div className="section-title">
            <h1 className="display-6" id="contact">
              Contact
            </h1>
            <h4>Akash & Hamza</h4>
            <div className="akash">
              <LinkBar
                Email="akashkrish27@gmail.com"
                Insta="https://www.instagram.com/a.kzsh/"
                Linkdn="https://www.linkedin.com/in/akash-san/"
                Github="https://github.com/AkashSanthanam"
              ></LinkBar>
            </div>
            <div className="hamza">
              <LinkBar
                Email="hamza88mehmood@hotmail.com "
                Insta=""
                Linkdn="https://www.linkedin.com/in/muhammad-hamza-mehmood-744a51215/"
                Github="https://github.com/ObliqueHacks"
              ></LinkBar>
            </div>
          </div>
        </Fade>
      </section>

      <Modal modalActive={modalActive} toggleModal={toggleModal}></Modal>
    </React.Fragment>
  );
}
export default HomePage;
