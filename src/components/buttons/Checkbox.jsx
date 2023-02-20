import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  border: 1px solid transparent;
  border-radius: 2px;

  ${(props) => (props.checked ? checkedStyles : uncheckedStyles)};
  //pointer-events: none;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
  //border: 0;
  clip: rect(0 0 0 0);
  //clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
  
  
`;

const Icon = styled.svg`
  stroke: #fff;
  stroke-width: 2;
  fill: none;
  fill-rule: evenodd;
  //pointer-events: none;
`;

const checkedStyles = css`
  background-color: ${({ theme }) => theme.newButton};
  border-color: transparent;
`;

const uncheckedStyles = css`
  background-color: ${({ theme }) => theme.editButtonHover};
`;

const StyledCheckbox = styled.div`
  
  display: inline-block;
  width: 16px;
  height: 16px;
  
  border-radius: 2px;
  transition: all 200ms;
  
  ${(props) => (props.checked ? checkedStyles : uncheckedStyles)};
  
  
  
  ${Icon} {
    visibility: ${(props) => (props.checked ? "visible" : "hidden")};
  }
`;

const Checkbox = ({ className, checked, ...props }) => (
  <CheckboxContainer className="styledCheckbox" checked={checked}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked} >
      <Icon width="10" height="8" viewBox="0 0 10 8">
        <path d="M1.5 4.5l2.124 2.124L8.97 1.28" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>
);
export default Checkbox;

Checkbox.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
};
