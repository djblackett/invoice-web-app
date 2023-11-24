import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const checkedStyles = css`
  background-color: ${({theme}) => theme.newButton};
  border-color: transparent;
`;

const uncheckedStyles = css`
  background-color: ${({theme}) => theme.editButtonHover};
`;

interface CheckedProps {
  readonly checked: boolean;
}

const CheckboxContainer = styled.div<CheckedProps>`
  display: inline-block;
  vertical-align: middle;
  border: 1px solid transparent;
  border-radius: 2px;
  ${( props ) => (props.checked ? checkedStyles : uncheckedStyles)};

`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
  clip: rect(0 0 0 0);
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
`;

const StyledCheckbox = styled.div<CheckedProps>`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 2px;
  transition: all 200ms;
  ${(props ) => (props.checked ? checkedStyles : uncheckedStyles)};
  ${Icon} {
    visibility: ${(props) => (props.checked ? "visible" : "hidden")};
  }
`;

export interface CheckboxProps extends CheckedProps {
  checked: boolean,
  className?: string;
}

function Checkbox({ className, checked=false, ...props }: CheckboxProps) {



  return <CheckboxContainer className="styledCheckbox" checked={checked}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox checked={checked} >
      <Icon width="10" height="8" viewBox="0 0 10 8">
        <path d="M1.5 4.5l2.124 2.124L8.97 1.28" />
      </Icon>
    </StyledCheckbox>
  </CheckboxContainer>;
}
export default Checkbox;

Checkbox.propTypes = {
  className: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};
