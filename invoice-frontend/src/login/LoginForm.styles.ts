// LoginForm.styles.js
import styled from "styled-components";

export const Container = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.background};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: ${({ theme }) => theme.textPlain};
  font-family: ${({ theme }) => theme.font};
`;

export const Input = styled.input`
  border-radius: 4px;
  font-size: 16px;
  color: ${({ theme }) => theme.textPlain};
  background-color: ${({ theme }) => theme.editButton};
  border-color: ${({ theme }) => theme.formFieldOutline};
  border-width: 1px;
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  font-family: ${({ theme }) => theme.font};
`;

export const Button = styled.button`
  padding: 10px;
  background-color: ${({ theme }) => theme.newButton};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.newButtonHover};
  }
`;

export const ErrorMessage = styled.p`
  color: #dc3545;
  margin-top: 10px;
`;

export const SuccessMessage = styled.p`
  color: #28a745;
  margin-top: 10px;
`;
