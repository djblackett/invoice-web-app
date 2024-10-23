import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { flushSync } from "react-dom";
import CancelButton from "../buttons/CancelButton";
import { FormType } from "../../types/types";
import { MenuContainer, Save, SaveAndDraftContainer, SaveDraft } from "../../styles/NewInvoiceBottomMenuStyles";

type NewInvoiceBoottemMenuProps = {
  closeText: string;
  justifyCancel: string;
  onSubmit: (data: FormType) => void;
  setIsDraft: (b: boolean) => void;
  setIsOpen: (b: boolean) => void;
};

function NewInvoiceBottomMenu({
  setIsDraft,
  setIsOpen,
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

  // These flush syncs should not cause performance problems because a single boolean value is being changed
  // React's built in batching for state changes made it difficult to dynamically tell react hook form
  // whether to require all fields or not

  const setToDraft = () => {
    flushSync(() => {
      setIsDraft(true);
      setValue("status", "draft");
    });

    onSubmit("draft");
  };

  const setToPending = () => {
    flushSync(() => {
      setIsDraft(false);
      setValue("status", "pending");
    });
    onSubmit("pending");
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
        <Save
          type="button"
          value="Save"
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
