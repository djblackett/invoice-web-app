import CancelButton from "../buttons/CancelButton";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useForm, useFormContext } from "react-hook-form";
import Proptypes from "prop-types";
import { isDraft } from "immer";
import { useEffect } from "react";

const MenuContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  display: flex;
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

  @media (min-width: 1200px) {
    height: 48px;
    width: 138px;
  }

  &:hover {
    background-color: #9277ff;
  }
`;

const SaveDraft = styled(NewInvoiceButton)`
  background-color: #373b53;
  color: #888eb0;
  margin-right: 8px;
  width: 133px;

  &:hover {
    background-color: #0c0e16;
  }
`;

const SaveAndDraftContainer = styled.div`
  display: contents;

  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
  }
`;

function NewInvoiceBottomMenu({
  setIsDraft,
  isDraft,
  setIsOpen,
  saveText,
  closeText,
  justifyCancel,
  setSubmitDirty,
  reset,
  setItems,
  onSubmit
}) {

  const { clearErrors, setValue } = useFormContext();

  // useEffect(() => {
  //   if (isDraft === false) {
  //     onSubmit();
  //   }
  // }, [isDraft]);

  const closeMenu = (e) => {
    // e.preventDefault();
    setSubmitDirty(false);
    clearErrors();
    setIsOpen(false);
    setItems([]);
    // HTMLFormElement.reset();
    reset();
  };

  const setToDraft = async (e) => {
    // e.stopPropagation();
    setIsDraft(true);
    setValue("status", "draft");
    // setTimeout(() => onSubmit(), 500);
    onSubmit();
  };

  const setToPending = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    setIsDraft(false);
    setValue("status", "pending");
    // console.log(isDraft);
    // setTimeout(() => console.log(isDraft), 5000);
    // setTimeout(() => onSubmit(), 1000);
    onSubmit();
  };


  return (
    <MenuContainer>
      <CancelButton
        handleClick={closeMenu}
        text={closeText}
        justifySelf={justifyCancel}
      />
      <SaveAndDraftContainer>
        <SaveDraft type="button" value="Save as draft" onClick={setToDraft} />
        <NewInvoiceButton
          type="button"
          value={saveText}
          onClick={setToPending}
        />
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
  setSubmitDirty: PropTypes.func.isRequired,
  reset: PropTypes.func,
  setItems: Proptypes.func.isRequired,
  isDraft: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
};
