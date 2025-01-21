import { ToastContainer } from "react-toastify";
import styled from "styled-components";

export const Main = styled.main`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.body};
  transition: all 0.4s ease-in-out;
  z-index: 1;

  @media (min-width: 1200px) {
    display: grid;
    grid-template: repeat(3, auto) / 1fr;
    justify-items: center;
  }

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

export const StyledToastContainer = styled(ToastContainer)<{
  marginTop: string | number;
}>`
  margin-top: ${(props) => props.marginTop};
  background-color: transparent;
`;
