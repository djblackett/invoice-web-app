// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
// workaround: https://github.com/testing-library/jest-dom/issues/427#issuecomment-1110985202
import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock motion/react (Framer Motion) for tests
// AnimatePresence and other motion components don't work well in test environments
vi.mock("motion/react", () => {
  // Create a higher-order component that strips motion props and renders the base element
  const createMotionComponent = (element: string) => {
    return React.forwardRef(({ children, ...props }: any, ref: any) => {
      // Filter out motion-specific props
      const {
        initial,
        animate,
        exit,
        variants,
        transition,
        whileHover,
        whileTap,
        whileFocus,
        whileDrag,
        drag,
        dragConstraints,
        dragElastic,
        dragMomentum,
        ...domProps
      } = props;

      return React.createElement(element, { ...domProps, ref }, children);
    });
  };

  return {
    AnimatePresence: ({ children }: { children: any }) => children,
    LazyMotion: ({ children }: { children: any }) => children,
    domAnimation: {},
    m: {
      div: createMotionComponent("div"),
      span: createMotionComponent("span"),
      p: createMotionComponent("p"),
      h1: createMotionComponent("h1"),
      h2: createMotionComponent("h2"),
      button: createMotionComponent("button"),
      form: createMotionComponent("form"),
    },
    motion: {
      div: createMotionComponent("div"),
      span: createMotionComponent("span"),
      p: createMotionComponent("p"),
      h1: createMotionComponent("h1"),
      h2: createMotionComponent("h2"),
      button: createMotionComponent("button"),
      form: createMotionComponent("form"),
    },
  };
});

// Mock @shelf/react-outside-click to avoid click detection issues in tests
vi.mock("@shelf/react-outside-click", () => ({
  ClickOutsideProvider: ({ children }: { children: any }) => children,
}));
