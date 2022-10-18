import Checkbox from "../buttons/Checkbox";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectFilter } from "../../features/invoices/filterSlice";




const CheckboxContainer = styled.div`

`

const Label = styled.label`
  pointer-events: none;
  cursor: pointer;
  box-sizing: border-box;
  margin-left: 0.5rem;
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
  const handleCheckboxChange = () => {};
  return (
    <CheckboxContainer >
      <Label>
        <Checkbox
          checked={filter[option.toLowerCase()]}
          onChange={handleCheckboxChange}

        />
        <span style={{ marginLeft: "13px" }}>{option}</span>
      </Label>
    </CheckboxContainer>
  );
}

CheckboxSelection.propTypes = {
  option: PropTypes.string.isRequired,
  handleOptionClick: PropTypes.func,
};

export default CheckboxSelection;
