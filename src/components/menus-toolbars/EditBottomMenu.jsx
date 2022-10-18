import CancelButton from "../buttons/CancelButton";
import styled from "styled-components";
import PropTypes from "prop-types";

const MenuContainer = styled.div`
  z-index: 100;
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 2.6rem;
  margin-bottom: 4rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const NewInvoiceButton = styled.input`
  border-radius: 24px;
  background-color: #7c5dfa;
  border: none;
  height: 44px;
  width: 90px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */
  letter-spacing: -0.25px;
  color: #ffffff;

  &:hover {
    background-color: #9277ff;
  }

  @media (min-width: 1200px) {
    height: 48px;
    width: 138px;
    padding-right: 1.5rem;
    padding-left: 1.5rem;
  }
`;

function EditBottomMenu({ setIsOpen, saveText, closeText, justifyCancel, setItems, invoice }) {
  const closeMenu = () => {
    setIsOpen(false);
    setItems(invoice.items);
  };

  return (
    <MenuContainer>
      <CancelButton
        handleClick={closeMenu}
        text={closeText}
        justifySelf={justifyCancel}
      />
      <NewInvoiceButton type={"submit"} value={saveText} />
    </MenuContainer>
  );
}

export default EditBottomMenu;

EditBottomMenu.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  saveText: PropTypes.string.isRequired,
  closeText: PropTypes.string.isRequired,
  justifyCancel: PropTypes.string,
    setItems: PropTypes.func,
    invoice: PropTypes.object,
};
