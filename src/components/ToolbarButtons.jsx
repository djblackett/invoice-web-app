import styled from "styled-components";
import EditButton from "./buttons/EditButton";
import DeleteButton from "./buttons/DeleteButton";
import MarkAsPaidButton from "./buttons/MarkAsPaidButton";
import PropTypes from "prop-types";

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

function ToolbarButtons({ toggleEditTab, invoice, openModal }) {
  return (
    <ButtonsContainer>
      <EditButton toggleEditTab={toggleEditTab} />
      <DeleteButton invoice={invoice} handleClick={openModal} />
      <MarkAsPaidButton invoice={invoice} />
    </ButtonsContainer>
  );
}

export default ToolbarButtons;

ToolbarButtons.propTypes = {
  toggleEditTab: PropTypes.func.isRequired,
  invoice: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
};
