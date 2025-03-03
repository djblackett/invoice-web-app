import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import CancelButton from "@/features/shared/components/buttons/CancelButton.tsx";
import {
  MenuContainer,
  Save,
  SaveAndDraftContainer,
  SaveDraft,
} from "../../../styles/NewInvoiceBottomMenuStyles.tsx";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider.tsx";
import { useNewInvoiceForm } from "../hooks/useNewInvoiceForm.tsx";

type NewInvoiceBoottemMenuProps = {
  closeText: string;
  justifyCancel?: string;
};

function NewInvoiceBottomMenu({
  closeText,
  justifyCancel,
}: NewInvoiceBoottemMenuProps) {
  const { clearErrors, reset, handleSubmit } = useFormContext();

  const { setIsNewInvoiceOpen } = useNewInvoiceContext();

  const { onSubmit, onSubmitDraft } = useNewInvoiceForm();

  const closeMenu = () => {
    clearErrors();
    setIsNewInvoiceOpen(false);
    reset();
  };

  // todo - revisit this and fix types
  return (
    <MenuContainer>
      <CancelButton
        handleClick={closeMenu}
        text={closeText}
        justifySelf={justifyCancel || ""}
      />
      <SaveAndDraftContainer>
        <SaveDraft
          type="button"
          value="Save as draft"
          onClick={onSubmitDraft}
        />
        <Save type="button" value="Save" onClick={handleSubmit(onSubmit)} />
      </SaveAndDraftContainer>
    </MenuContainer>
  );
}

export default NewInvoiceBottomMenu;

NewInvoiceBottomMenu.propTypes = {
  closeText: PropTypes.string.isRequired,
  justifyCancel: PropTypes.string,
};
