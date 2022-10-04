import Checkbox from "../buttons/Checkbox";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeFilter } from "../../features/invoices/filterSlice";
import { selectFilter } from "../../features/invoices/filterSlice";
import { useEffect } from "react";

const Label = styled.label`
  /* pointer-events: none; */
  cursor: pointer;
  box-sizing: border-box;
  margin-left: 0.5rem;
  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
  color: ${({ theme }) => theme.textPlain};
  &:hover {
    .styledCheckbox {
      border: 1px solid ${({ theme }) => theme.outline};
    }

    cursor: pointer;
  }
`;

function CheckboxSelection({ option }) {
  const filter = useSelector(selectFilter);
  const handleCheckboxChange = (event) => {};
  return (
    <div>
      <Label onClick={(e) => e.preventDefault()}>
        <Checkbox
          checked={filter[option.toLowerCase()]}
          onChange={handleCheckboxChange}
        />
        <span style={{ marginLeft: "13px" }}>{option}</span>
      </Label>
    </div>
  );
}

CheckboxSelection.propTypes = {
  option: PropTypes.string.isRequired,
  handleOptionClick: PropTypes.func,
};

export default CheckboxSelection;
