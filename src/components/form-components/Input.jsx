import styled from "styled-components";
import React, { useState } from "react";
import PropTypes from "prop-types";

export const InputStyles = styled.input`
  width: 240px;
  height: 48px;
  border-radius: 4px;
  border-color: ${({ theme }) => theme.formFieldOutline};
  /* outline: none; */
  padding: 17px 20px 16px 20px;
  margin-bottom: 1.5rem;
  font-family: ${({ theme }) => theme.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* margin-left:5px; */
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
  color: ${({ theme }) => theme.textPlain};
  background-color: ${({ theme }) => theme.editButton};

  &:focus {
    border-color: black;
  }

  .custom-input {
    padding: 0;
  }
`;

function Input({ width }) {
  return <InputStyles style={{ width: `${width}px` }} />;
}

export default Input;
Input.propTypes = {
  width: PropTypes.number,
};
