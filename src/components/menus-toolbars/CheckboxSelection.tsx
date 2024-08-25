import PropTypes from "prop-types";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Checkbox from "../buttons/Checkbox";
import { selectFilter } from "../../features/invoices/filterSlice";
import {FilterOptions, StatusKey} from "../../types/types";

const CheckboxContainer = styled.div`

`;

const Label = styled.div`
  cursor: pointer;
  box-sizing: border-box;
  margin-left: 0.5rem;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: ${({ theme }) => theme.textPlain};
`;

type CheckboxSelectionProps = {
  option: string
}

function CheckboxSelection({ option }: CheckboxSelectionProps) {
  const filter: FilterOptions = useSelector(selectFilter);
  const loweredOption = option.toLowerCase() as StatusKey;
  const isSelected = filter[loweredOption];
  return (
    <CheckboxContainer >
      <Label>
        <Checkbox checked={isSelected} />
        <span style={{ marginLeft: "13px", fontFamily: "League Spartan", fontWeight: 700 }}>{option}</span>
      </Label>
    </CheckboxContainer>
  );
}

CheckboxSelection.propTypes = {
  option: PropTypes.string.isRequired,
};

export default CheckboxSelection;
