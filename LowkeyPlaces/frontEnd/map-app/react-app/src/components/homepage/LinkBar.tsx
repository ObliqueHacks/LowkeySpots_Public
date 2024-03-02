import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Fade } from "react-awesome-reveal";

const Linkbar = ({
  Email,
  Insta,
  Linkdn,
  Github,
}: {
  Email: string;
  Insta: string;
  Linkdn: string;
  Github: string;
}) => {
  const socialLinks = [
    {
      icon: MdEmail,
      href: Email,
      target: "_blank",
      rel: "noreferrer",
    },
    {
      icon: FaInstagram,
      href: Insta,
      target: "_blank",
      rel: "noreferrer",
    },
    {
      icon: FaLinkedin,
      href: Linkdn,
      target: "_blank",
      rel: "noreferrer",
    },
    {
      icon: FaGithub,
      href: Github,
      target: "_blank",
      rel: "noreferrer",
    },
  ];

  return (
    <div className="linkbar">
      <ul>
        {socialLinks.map((link, index) => (
          <li key={index}>
            <Fade delay={index * 200} triggerOnce={true}>
              <a
                href={link.href}
                target={link.target}
                rel={link.rel}
                className="social-icon"
              >
                <link.icon />
              </a>
            </Fade>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Linkbar;
