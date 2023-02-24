import styled from "styled-components";
import Proptypes from "prop-types";

const Button = styled.button`
  background-color: ${({ theme }) => theme.editButton};
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: ${({ theme }) => theme.greyText};
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  margin: 0.25rem;
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;

  &:hover {
    background-color: ${({ theme }) => theme.editButtonHover};
  }
`;
function EditButton({ toggleEditTab }) {
  return <Button onClick={toggleEditTab} type="button">Edit</Button>;
}

export default EditButton;

EditButton.propTypes = {
  toggleEditTab: Proptypes.func.isRequired,
};
