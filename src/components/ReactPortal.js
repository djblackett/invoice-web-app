// src/components/ReactPortal.js
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { useState, useLayoutEffect } from "react";
// ...

function ReactPortal({ children, wrapperId = "react-portal-wrapper" }) {
  // Also, set a default value for wrapperId prop if none provided
  const [wrapperElement, setWrapperElement] = useState(null);

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;
    // if element is not found with wrapperId or wrapperId is not provided,
    // create and append to body
    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }
    setWrapperElement(element);

    return () => {
      // delete the programatically created element
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  // wrapperElement state will be null on the very first render.
  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
}

ReactPortal.propTypes = {
  children: PropTypes.node.isRequired,
  wrapperId: PropTypes.string,
};

export default ReactPortal;

function createWrapperAndAppendToBody(wrapperId) {
  const wrapperElement = document.createElement("div");
  wrapperElement.setAttribute("id", wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
}
