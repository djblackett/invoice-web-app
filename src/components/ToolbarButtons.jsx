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
  height: 91px;
  padding: 1.4rem 1.5rem;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: ${({ theme }) => theme.background};
  margin-top: 3.5rem;

  @media (min-width: 768px) {
    /* justify-self: initial; */
    height: initial;
    width: initial;
    position: static;
    margin-top: initial;
    background-color: initial;
  }
`;

function ToolbarButtons({ toggleEditTab, invoice, openModal, setItems }) {
  return (
    <ButtonsContainer>
      <EditButton toggleEditTab={toggleEditTab} setItems={setItems} />
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
  setItems: PropTypes.func,
};
