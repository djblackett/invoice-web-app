import Checkbox from "./buttons/Checkbox";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { changeFilter } from "../features/invoices/filterSlice";
import { selectFilter } from "../features/invoices/filterSlice";

const Label = styled.label`
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
}
`

function  CheckboxSelection({option}) {
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();
  const [state, setState] = useState({ checked: false });

const handleCheckboxChange = event => {
  // setState({ checked: event.target.checked });
  dispatch(changeFilter(option.toLowerCase()));
}
    return (
      <div>

        <Label>
          <Checkbox
            checked={filter[option.toLowerCase()]}
            onChange={handleCheckboxChange}
            
          />
          <span style={{marginLeft: '13px'}}>{option}</span>
        </Label>
      </div>    
    ) 

}

CheckboxSelection.propTypes = { option: PropTypes.string.isRequired }

export default CheckboxSelection;
