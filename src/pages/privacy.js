import { Row, Col, Navbar, Container } from "reactstrap";
// import "./arsha.css";
import "./arsha.js";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  BsEnvelope,
  BsFacebook,
  BsGeoAlt,
  BsInstagram,
  BsLinkedin,
  BsPhone,
  BsSkype,
  BsTwitter,
} from "react-icons/bs";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { BiEnvelope, BiPhone } from "react-icons/bi";
import { GrLocation } from "react-icons/gr";
const Contact = () => {
  const history = useHistory();
  const [scroll, setScroll] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [open, setOpen] = useState("1");
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };
  const toggleCollapse = () => {
    setShowMenu(!showMenu);
  };
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 100);
    });
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <header
        id="header"
        className={`${scroll ? "header-scrolled" : ""} fixed-top`}
      >
        <Container className="d-flex align-items-center">
          <h1 className="logo m-auto">
            {/* <a href="javascript:void(0)">AccountDigi</a> */}
            <a href="javascript:void(0)" className="logo me-auto">
              <img
                src={require("../assets/img/brand/logo.png")}
                alt=""
                className="img-fluid"
              />
            </a>
          </h1>

          <nav id="navbar" className="navbar">
            <ul>
              <li>
                <a
                  className="nav-link scrollto"
                  href="javascript:void(0)"
                  onClick={() => history.push("/index")}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  className="nav-link scrollto"
                  href="javascript:void(0)"
                  onClick={() => history.push("/index#about")}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  className="nav-link scrollto"
                  href="javascript:void(0)"
                  onClick={() => history.push("/index#services")}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  className="nav-link "
                  href="javascript:void(0)"
                  onClick={() => history.push("/pricing")}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  className="nav-link scrollto active"
                  href="javascript:void(0)"
                  onClick={() => history.push("/contactus")}
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  className="getstarted scrollto"
                  href="javascript:void(0)"
                  onClick={() => history.push("/auth/login")}
                >
                  Login
                </a>
              </li>
              <li>
                <a
                  className="getstarted scrollto"
                  href="javascript:void(0)"
                  onClick={() => history.push("/auth/register")}
                >
                  Signup
                </a>
              </li>
            </ul>
            <i className="mobile-nav-toggle" onClick={toggleCollapse}>
              {/* <span className="navbar-toggler-icon" /> */}
              {showMenu ? (
                <AiOutlineClose color="white" fontSize={24} />
              ) : (
                <AiOutlineMenu color="black" fontSize={24} />
              )}
            </i>
          </nav>
        </Container>
      </header>

      <main id="main">
        <section id="contact" className="contact">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Privacy Policy</h2>
              <p>Coming soon !!</p>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer">
        <div class="footer-top">
          <div class="container">
            <div class="row">
              <div class="col-lg-3 col-md-6 footer-contact">
                <h3>
                  <a href="javascript:void(0)" className="logo me-auto">
                    <img
                      src={require("../assets/img/brand/logo.png")}
                      alt=""
                      className="img-fluid"
                    />
                  </a>
                </h3>
                <p>
                  Prisha Software Private Limited <br />
                  406/A, 4th Floor ,Shivalay Complex, Near Mavdi Chowk,Mavdi
                  <br />
                  Main Road, Rajkot A108 Adam Street <br />
                  {/* A108 Adam Street <br />
                  New York, NY 535022
                  <br />
                  United States <br /> */}
                  <br />
                  <strong>Phone:</strong> +91 63536 51151
                  <br />
                  <strong>Email:</strong> info@accountdigi.com
                  <br />
                </p>
              </div>

              <div class="col-lg-3 col-md-6 footer-links">
                <h4>Useful Links</h4>
                <ul>
                  <li>
                    <i class="bx bx-chevron-right"></i>{" "}
                    <a onClick={() => history.push("/index")}>Home</a>
                  </li>
                  <li>
                    <i class="bx bx-chevron-right"></i>{" "}
                    <a onClick={() => history.push("/index#about")}>About us</a>
                  </li>
                  <li>
                    <i class="bx bx-chevron-right"></i>{" "}
                    <a onClick={() => history.push("/index#services")}>
                      Services
                    </a>
                  </li>
                  <li>
                    <i class="bx bx-chevron-right"></i>{" "}
                    <a href="" onClick={() => history.push("/terms")}>
                      Terms of service
                    </a>
                  </li>
                  <li>
                    <i class="bx bx-chevron-right"></i>{" "}
                    <a href="#">Privacy policy</a>
                  </li>
                </ul>
              </div>

              <div class="col-lg-3 col-md-6 footer-links">
                <h4>Our Services</h4>
                <ul>
                  <li>
                    <i class="bx bx-chevron-right"></i>{" "}
                    <a href="#">Web Design</a>
                  </li>
                  <li>
                    <i class="bx bx-chevron-right"></i>{" "}
                    <a href="#">Web Development</a>
                  </li>
                  <li>
                    <i class="bx bx-chevron-right"></i>{" "}
                    <a href="#">Product Management</a>
                  </li>
                  <li>
                    <i class="bx bx-chevron-right"></i>{" "}
                    <a href="#">Marketing</a>
                  </li>
                  <li>
                    <i class="bx bx-chevron-right"></i>{" "}
                    <a href="#">Graphic Design</a>
                  </li>
                </ul>
              </div>

              <div class="col-lg-3 col-md-6 footer-links">
                <h4>Our Social Networks</h4>
                <p>
                  Cras fermentum odio eu feugiat lide par naso tierra videa
                  magna derita valies
                </p>
                <div class="social-links mt-3">
                  <a href="#" class="twitter">
                    <BsTwitter size={12} />
                  </a>
                  <a href="#" class="facebook">
                    <BsFacebook size={12} />
                  </a>
                  <a href="#" class="instagram">
                    <BsInstagram size={12} />
                  </a>
                  <a href="#" class="google-plus">
                    <BsSkype size={12} />
                  </a>
                  <a href="#" class="linkedin">
                    <BsLinkedin size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container footer-bottom clearfix">
          <div class="copyright">
            &copy; Copyright{" "}
            <strong>
              <span>Prisha Software Pvt Ltd</span>
            </strong>
            . All Rights Reserved
          </div>
        </div>
      </footer>
    </>
  );
};
export default Contact;
