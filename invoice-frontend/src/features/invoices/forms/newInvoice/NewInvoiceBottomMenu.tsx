import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import CancelButton from "@/features/shared/components/buttons/CancelButton.tsx";
import {
  MenuContainer,
  Save,
  SaveAndDraftContainer,
  SaveDraft,
} from "../../../../styles/NewInvoiceBottomMenuStyles.tsx";
import { useNewInvoiceContext } from "../NewInvoiceContextProvider.tsx";
import { useNewInvoiceForm } from "../../hooks/useNewInvoiceForm.tsx";
import useWindowWidth from "@/features/shared/hooks/useWindowWidth.tsx";
import useFormCaching from "../../hooks/useFormCaching.ts";
import blankDefaultValues from "../defaultValues.ts";

type NewInvoiceBoottemMenuProps = {
  closeText: string;
  justifyCancel?: string;
};

function NewInvoiceBottomMenu({
  closeText,
  justifyCancel,
}: NewInvoiceBoottemMenuProps) {
  const { clearErrors, handleSubmit } = useFormContext();

  const {
    setIsNewInvoiceOpen,
    setStartDate,
    setSelectedPaymentOption,
    setIsCacheActive,
    methods,
  } = useNewInvoiceContext();

  const { reset } = methods;

  const { onSubmit, onSubmitDraft } = useNewInvoiceForm();
  const { clearCache } = useFormCaching("cachedNewInvoiceForm");

  const closeMenu = () => {
    setIsCacheActive(false);
    clearCache();

    clearErrors();

    setIsNewInvoiceOpen(false);

    reset(blankDefaultValues);

    setStartDate(new Date());
    setSelectedPaymentOption(1);
  };

  const width = useWindowWidth();

  // TODO - fix these types - Code works fine, but I can't please TypeScript
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
          value={width > 325 ? "Save as draft" : "Draft"}
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
