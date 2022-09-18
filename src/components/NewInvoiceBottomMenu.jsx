import CancelButton from "./buttons/CancelButton";
import styled from "styled-components";
import PropTypes from "prop-types";

const MenuContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-top: 2.6rem;
`;



const NewInvoiceButton = styled.input`
  border-radius: 24px;
  background-color: #7c5dfa;
  border: none;
  height: 44px;
  width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* margin-left: 40px; */
  cursor: pointer;

  font-family: "Spartan";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;

  color: #ffffff;

  @media (min-width: 1200px) {
    height: 48px;
    width: 138px;
    /* padding-right: 1rem; */
    /* padding-left: 0.5rem; */
  }

  &:hover {
    background-color: #9277FF;
  }
`;

const SaveDraft = styled(NewInvoiceButton)`
  background-color: #373B53;
  color: #888EB0;
  margin-right: 8px;
  width: 133px;

  &:hover {
    background-color: #0C0E16;
  }

`;

const SaveAndDraftContainer = styled.div`
  display: flex;
  flex-direction: row;

`

function NewInvoiceBottomMenu({ setIsDraft, setIsOpen, saveText, closeText, justifyCancel }) {
  const closeMenu = (e) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const setToDraft = () => {
    setIsDraft(true);
  }

  return (
    <MenuContainer>
      <CancelButton
        handleClick={closeMenu}
        text={closeText}
        justifySelf={justifyCancel}
      />
      <SaveAndDraftContainer>
      <SaveDraft type="submit" value="Save as draft" onClick={setToDraft}/>
      <NewInvoiceButton type="submit" value={saveText} />
      </SaveAndDraftContainer>
    </MenuContainer>
  );
}

export default NewInvoiceBottomMenu;

NewInvoiceBottomMenu.propTypes = {
  setIsDraft: PropTypes.func,
  setIsOpen: PropTypes.func.isRequired,
  saveText: PropTypes.string.isRequired,
  closeText: PropTypes.string.isRequired,
  justifyCancel: PropTypes.string,
};
