import styled from "styled-components";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { flushSync } from "react-dom";
import CancelButton from "../buttons/CancelButton";

const MenuContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-top: 2.6rem;
  margin-bottom: 4rem;
  align-self: center;
  transform: scale(0.9);

  @media (min-width: 325px) {
    justify-content: space-between;
    transform: scale(1);
  }

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
  flex-shrink: 1;
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

type NewInvoiceBoottemMenuProps = {
  closeText: string;
  justifyCancel: string;
  onSubmit: () => void;
  saveText: string;
  setIsDraft: (b: boolean) => void;
  setIsOpen: (b: boolean) => void;
};

function NewInvoiceBottomMenu({
  setIsDraft,
  setIsOpen,
  saveText,
  closeText,
  justifyCancel,
  onSubmit,
}: NewInvoiceBoottemMenuProps) {
  const { clearErrors, setValue, reset } = useFormContext();

  const closeMenu = () => {
    clearErrors();
    setIsOpen(false);
    reset();
  };

  const setToDraft = () => {
    flushSync(() => {
      setIsDraft(true);
      setValue("status", "draft");
    });

    onSubmit();
  };

  const setToPending = () => {
    flushSync(() => {
      setIsDraft(false);
      setValue("status", "pending");
    });
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
  setIsDraft: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  saveText: PropTypes.string.isRequired,
  closeText: PropTypes.string.isRequired,
  justifyCancel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
