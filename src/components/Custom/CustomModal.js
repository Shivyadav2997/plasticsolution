import React, { Children, useState } from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const CustomModal = ({ children, handleToggle, show, title, footer }) => {
  return (
    <>
      <Modal isOpen={show} toggle={handleToggle}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={handleToggle}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <ModalBody className="pt-0 bg-secondary">{children}</ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </Modal>
    </>
  );
};

export default CustomModal;
