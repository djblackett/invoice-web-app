import { SubmitHandler, useFormContext } from "react-hook-form";
import CancelButton from "@/features/shared/components/buttons/CancelButton.tsx";
import {
  MenuContainer,
  Save,
  SaveAndDraftContainer,
  SaveDraft,
} from "@/styles/NewInvoiceBottomMenuStyles.tsx";
import { useNewInvoiceContext } from "../NewInvoiceContextProvider.tsx";
import useWindowWidth from "@/features/shared/hooks/useWindowWidth.tsx";
import useFormCaching from "../../hooks/useFormCaching.ts";
import blankDefaultValues from "../defaultValues.ts";
import { useSubmitDraft } from "../../hooks/useSubmitDraft.ts";
import { useSubmitNewInvoice } from "../../hooks/useSubmitNewInvoice.ts";

type NewInvoiceBottemMenuProps = {
  closeText: string;
  justifyCancel?: string;
};

function NewInvoiceBottomMenu({
  closeText,
  justifyCancel,
}: NewInvoiceBottemMenuProps) {
  const { clearErrors, handleSubmit } =
    useFormContext<typeof blankDefaultValues>();

  const {
    setIsNewInvoiceOpen,
    setStartDate,
    setSelectedPaymentOption,
    setIsCacheActive,
    methods,
  } = useNewInvoiceContext();

  const { reset } = methods;
  const onSubmit = useSubmitNewInvoice();
  const onSubmitDraft = useSubmitDraft();
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

  return (
    <MenuContainer>
      <CancelButton
        handleClick={closeMenu}
        text={closeText}
        justifySelf={justifyCancel || ""}
      />
      <SaveAndDraftContainer>
        <SaveDraft
          data-testid="saveDraft"
          type="button"
          value={width > 325 ? "Save as draft" : "Draft"}
          onClick={handleSubmit(
            onSubmitDraft as unknown as SubmitHandler<
              typeof blankDefaultValues
            >,
          )}
        />
        <Save
          type="button"
          value="Save"
          onClick={handleSubmit(
            onSubmit as unknown as SubmitHandler<typeof blankDefaultValues>,
          )}
        />
      </SaveAndDraftContainer>
    </MenuContainer>
  );
}

export default NewInvoiceBottomMenu;
