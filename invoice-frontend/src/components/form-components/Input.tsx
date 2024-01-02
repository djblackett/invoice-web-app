import styled from "styled-components";
import React from "react";

export const InputStyles = styled.input`
  width: 240px;
  height: 48px;
  border-radius: 4px;
  border-color: var(--color-form-field-outline);
  border-width: 1px;
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  font-family: var(--theme-font);
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: var(--colors-text-plain);
  background-color: var(colors-edit-button);

  &:focus {
    border-color: black;
  }

  .custom-input {
    padding: 0;
  }
`;

type InputProps = {
  width: number;
};

function Input({ width }: InputProps) {
  return <InputStyles style={{ width: `${width}px` }} />;
}

export default Input;
