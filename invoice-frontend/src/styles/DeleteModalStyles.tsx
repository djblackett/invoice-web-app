import * as m from "motion/react-m";
import styled from "styled-components";
export const ModalContainer = styled(m.div)`
  display: flex;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  padding: 3rem;
  background-color: ${({ theme }) => theme.background};
  max-width: 480px;
  border-radius: 8px;
  box-shadow: 0px 10px 10px -10px rgba(72, 84, 159, 0.100397);
  margin: 0 1.5rem;
`;

export const Confirm = styled.h1`
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  /* identical to box height, or 133% */
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.text};
  margin: 0;
  margin-bottom: 13px;
`;
export const ButtonContainer = styled.div`
  display: flex;
  align-self: flex-end;
  justify-content: center;
`;
