import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import CancelButton from "@/features/shared/components/buttons/CancelButton.tsx";
import { MenuContainer, Save } from "@/styles/NewInvoiceBottomMenuStyles.tsx";
import { useNewInvoiceContext } from "../NewInvoiceContextProvider.tsx";

import { FormType } from "@/features/invoices/types/invoiceTypes.ts";
import useFormCaching from "../../hooks/useFormCaching.ts";
import { invoiceDefaultValues } from "../defaultValues.ts";
import { useSubmitEditedInvoice } from "../../hooks/useSubmitEditedInvoice.ts";

type EditBottomMenuProps = {
  closeText: string;
  justifyCancel: string;
  saveText: string;
};

function EditBottomMenu({
  saveText,
  closeText,
  justifyCancel,
}: EditBottomMenuProps) {
  const { reset } = useFormContext();

  const { setIsNewInvoiceOpen, setIsCacheActive } = useNewInvoiceContext();
  const editFormCache = useFormCaching("cachedEditForm");

  const closeMenu = () => {
    setIsNewInvoiceOpen(false);
    editFormCache.clearCache();
    setIsCacheActive(false);
    reset(invoiceDefaultValues);
  };

  const { handleSubmit } = useFormContext<FormType>();
  const { onSubmitUpdate } = useSubmitEditedInvoice();

  return (
    <MenuContainer>
      <CancelButton
        handleClick={closeMenu}
        text={closeText}
        justifySelf={justifyCancel}
      />
      <Save
        type="button"
        value={saveText}
        onClick={handleSubmit(onSubmitUpdate)}
      />
    </MenuContainer>
  );
}

export default EditBottomMenu;

EditBottomMenu.propTypes = {
  saveText: PropTypes.string.isRequired,
  closeText: PropTypes.string.isRequired,
};
