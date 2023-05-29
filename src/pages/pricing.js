import { Row, Col, Navbar, Container } from "reactstrap";
// import "./arsha.css";
import "./arsha.js";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const Pricing = () => {
  const history = useHistory();
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 100);
    });
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
                  className="nav-link active"
                  href="javascript:void(0)"
                  onClick={() => history.push("/pricing")}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  className="nav-link scrollto"
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
            <i className="bi bi-list mobile-nav-toggle"></i>
          </nav>
        </Container>
      </header>
      <section id="hero" className="d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h1>Better Solutions For Your Business</h1>
              <h2>
                We are team of talented designers making websites with Bootstrap
              </h2>
              <div className="d-flex justify-content-center justify-content-lg-start">
                <a href="#about" className="btn-get-started scrollto">
                  Get Started
                </a>
                <a
                  href="https://www.youtube.com/watch?v=jDDaplaOz7Q"
                  className="glightbox btn-watch-video"
                >
                  <i className="bi bi-play-circle"></i>
                  <span>Watch Video</span>
                </a>
              </div>
            </div>
            <div
              className="col-lg-6 order-1 order-lg-2 hero-img"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <img
                src={require("../assets/img/hero-img.png")}
                className="img-fluid animated"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      <main id="main">
        <section id="pricing" className="pricing">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Pricing</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
            </div>

            <div className="row">
              <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
                <div className="box">
                  <h3>Free Plan</h3>
                  <h4>
                    <sup>$</sup>0<span>per month</span>
                  </h4>
                  <ul>
                    <li>
                      <i className="bx bx-check"></i> Quam adipiscing vitae
                      proin
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Nec feugiat nisl pretium
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Nulla at volutpat diam
                      uteera
                    </li>
                    <li className="na">
                      <i className="bx bx-x"></i>{" "}
                      <span>Pharetra massa massa ultricies</span>
                    </li>
                    <li className="na">
                      <i className="bx bx-x"></i>{" "}
                      <span>Massa ultricies mi quis hendrerit</span>
                    </li>
                  </ul>
                  <a href="#" className="buy-btn">
                    Get Started
                  </a>
                </div>
              </div>

              <div
                className="col-lg-4 mt-4 mt-lg-0"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="box featured">
                  <h3>Business Plan</h3>
                  <h4>
                    <sup>$</sup>29<span>per month</span>
                  </h4>
                  <ul>
                    <li>
                      <i className="bx bx-check"></i> Quam adipiscing vitae
                      proin
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Nec feugiat nisl pretium
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Nulla at volutpat diam
                      uteera
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Pharetra massa massa
                      ultricies
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Massa ultricies mi quis
                      hendrerit
                    </li>
                  </ul>
                  <a href="#" className="buy-btn">
                    Get Started
                  </a>
                </div>
              </div>

              <div
                className="col-lg-4 mt-4 mt-lg-0"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="box">
                  <h3>Developer Plan</h3>
                  <h4>
                    <sup>$</sup>49<span>per month</span>
                  </h4>
                  <ul>
                    <li>
                      <i className="bx bx-check"></i> Quam adipiscing vitae
                      proin
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Nec feugiat nisl pretium
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Nulla at volutpat diam
                      uteera
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Pharetra massa massa
                      ultricies
                    </li>
                    <li>
                      <i className="bx bx-check"></i> Massa ultricies mi quis
                      hendrerit
                    </li>
                  </ul>
                  <a href="#" className="buy-btn">
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
export default Pricing;
