import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import logo from "assets/img/brand/logo.png";
import { useSelector } from "react-redux";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
const Index = () => {
  const { user } = useSelector((store) => store.user);
  return (
    <Container className="pt-6" fluid style={{ minHeight: "80vh" }}>
      <Row>
        <Col md={3}></Col>
        <Col md={6}>
          <Card style={{ borderTop: "3px solid #007bff" }}>
            <CardBody>
              <div className="text-center">
                <img src={logo} alt="plastic-logo" style={{ width: "200px" }} />
              </div>
              <h3
                className="text-center"
                style={{ fontSize: "21px", marginTop: "5px" }}
              >
                {/* AccountDigi */}
              </h3>
              <p className="text-center text-muted"></p>
              <ListGroup>
                <ListGroupItem className="border-left-0 border-right-0">
                  <b>Mobile No.</b>
                  <span className="float-right">
                    9662779868
                    <br></br>
                    <Button
                      className="btn-neutral btn-icon btn-sm"
                      color="success"
                    >
                      <a
                        className="ml-1"
                        href={`whatsapp://send?phone=9662779868`}
                      >
                        <FaWhatsapp size={18} />
                      </a>
                    </Button>
                    <Button
                      className="btn-neutral btn-icon btn-sm"
                      color="default"
                    >
                      <a href={`tel:9662779868`}>
                        <FaPhoneAlt size={16} />
                      </a>
                    </Button>
                  </span>
                </ListGroupItem>
                <ListGroupItem className="border-left-0 border-right-0">
                  <b>Email</b>
                  <a className="float-right">lakkadjignesh@gmail.com</a>
                </ListGroupItem>
                <ListGroupItem className="border-left-0 border-right-0">
                  <b>City</b>
                  <a className="float-right">Rajkot</a>
                </ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Index;
