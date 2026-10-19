import { ToastContainer, ToastContainerProps, Theme } from "react-toastify";
import styled from "styled-components";

export const Main = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.body};
  transition: all 0.4s ease-in-out;
  z-index: 1;

  // applies the appropriate theme to each status type
  .draft {
    background: ${({ theme }) => theme.draftBackgroundColor};
    color: ${({ theme }) => theme.draftColor};

    .circle {
      background: ${({ theme }) => theme.draftColor};
    }
  }

  .pending {
    background-color: rgba(255, 143, 0, 0.06);
    color: rgb(255, 143, 0);
    .circle {
      background: rgb(255, 143, 0);
    }
  }

  .paid {
    background-color: rgba(51, 214, 159, 0.06);
    color: #33d69f;
    .circle {
      background: #33d69f;
    }
  }
`;

// Keep Toastify's theme separate from the styled-components theme.
const ThemedToastContainer = ({
  colorMode,
  ...props
}: Omit<ToastContainerProps, "theme"> & { colorMode: Theme }) => (
  <ToastContainer
    // React 19 no longer applies function defaults; preserve Toastify v9's defaults.
    {...(ToastContainer as { defaultProps?: ToastContainerProps }).defaultProps}
    {...props}
    theme={colorMode}
  />
);

export const StyledToastContainer = styled(ThemedToastContainer)`
  && {
    position: fixed;
    top: 168px;
    right: 16px;
    left: auto;
    width: min(320px, calc(100vw - 32px));
    padding: 0;
    margin: 0;
    --toastify-font-family: "League Spartan", sans-serif;
    --toastify-color-light: ${({ theme }) => theme.background};
    --toastify-color-dark: ${({ theme }) => theme.background};
    --toastify-text-color-light: ${({ theme }) => theme.text};
    --toastify-text-color-dark: ${({ theme }) => theme.text};
  }

  .Toastify__close-button {
    color: inherit;
  }

  .Toastify__toast {
    border-radius: 8px;
    font-size: 14px;
  }

  @media (min-width: 600px) and (max-width: 1199px) {
    && {
      top: 248px;
    }
  }

  @media (min-width: 1200px) {
    && {
      top: 8px;
    }
  }
`;

export const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap; /* added for consistency */
  border: 0;
`;
