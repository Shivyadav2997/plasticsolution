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
import { CustomInput } from "components/Custom/CustomInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
const Profile = () => {
  const { user } = useSelector((store) => store.user);
  console.log("us", user);
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
                VISHVA DEMO
              </h3>
              <p className="text-center text-muted">
                Vishva
                <b>
                  <br />
                  Renew 284 Days Left
                </b>
              </p>
              <ListGroup>
                <ListGroupItem className="border-left-0 border-right-0">
                  <b>Mobile No. 7984404605</b>
                  <a className="float-right">Create Date : 17-Jan-2023</a>
                </ListGroupItem>
                <ListGroupItem className="border-left-0 border-right-0">
                  <b>Email</b>
                </ListGroupItem>
                <ListGroupItem className="border-left-0 border-right-0">
                  <b>Gst No.</b>
                </ListGroupItem>
                <ListGroupItem className="border-left-0 border-right-0">
                  <b>City</b>
                </ListGroupItem>
                <ListGroupItem className="border-left-0 border-right-0">
                  <b>Address</b>
                </ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
