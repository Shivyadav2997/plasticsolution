import React, { Children, useEffect, useState } from "react";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { createPortal } from "react-dom";
import { FaCross } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
const CustomModal = ({
  children,
  handleToggle,
  show,
  title,
  footer,
  iframe,
  fullscreen,
  ...props
}) => {
  const [contentRef, setContentRef] = useState(null);
  const mountNode = contentRef?.contentWindow?.document?.body;

  useEffect(() => {
    if (show) {
      const intervalId = setInterval(() => {
        const firstInput = document.querySelector(
          ".modal-body input:not([disabled]), .modal-body select:not([disabled])"
        );
        if (firstInput) {
          clearInterval(intervalId);
          firstInput.focus();
        }
      }, 500);
    }
  }, [show]);
  return (
    <>
      <Modal
        isOpen={show}
        // modalClassName="modal-fullscreen"
        className={`${fullscreen ? "modal-fullscreen" : ""}`}
        toggle={handleToggle}
        backdrop={false}
        {...props}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={handleToggle}
          >
            <span aria-hidden="true">
              <AiOutlineClose />
            </span>
          </button>
        </div>
        <ModalBody className="pt-0 bg-secondary">
          {iframe ? (
            <iframe
              style={{ minWidth: "100%", height: "100%" }}
              ref={setContentRef}
              id="iframe"
            >
              {mountNode && createPortal(children, mountNode)}
            </iframe>
          ) : (
            children
          )}
        </ModalBody>
        <ModalFooter className={fullscreen ? "justify-content-start" : ""}>
          {footer}
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CustomModal;
