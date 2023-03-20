import React, { Children, useState } from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const CustomModal = ({ children, handleToggle, show, title, footer }) => {
  return (
    <>
      <Modal isOpen={show} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle}>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </Modal>
    </>
  );
};

export default CustomModal;
