// src/components/Modal/Modal.js
// import "./modalStyles.css";
import { useEffect } from "react";
import ReactPortal from "./ReactPortal";
import PropTypes from "prop-types";

function Modal({ children, isOpen, handleClose }) {
  useEffect(() => {
    const closeOnEscapeKey = (e) => (e.key === "Escape" ? handleClose() : null);
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div className="modal">
        <button onClick={handleClose} className="close-btn">
          Close
        </button>
        <div className="modal-content">{children}</div>
      </div>
    </ReactPortal>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
};
export default Modal;
