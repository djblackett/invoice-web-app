import styled from 'styled-components';

const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.buttonBackground};
  border-radius: 24px;
`;

function Button({ children }) {
  return <PrimaryButton>{children}</PrimaryButton>;
}

export default Button;
