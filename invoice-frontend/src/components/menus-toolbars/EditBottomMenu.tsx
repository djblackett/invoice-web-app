import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import CancelButton from "../buttons/CancelButton";
import { MenuContainer, Save } from "../../styles/NewInvoiceBottomMenuStyles";
import { useNewInvoiceForm } from "../../features/invoices/hooks/useNewInvoiceForm.tsx";
import { useNewInvoiceContext } from "../../features/invoices/forms/NewInvoiceContextProvider.tsx";
import { FormType } from "@/types/types";

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

  const { setIsNewInvoiceOpen } = useNewInvoiceContext();

  const closeMenu = () => {
    setIsNewInvoiceOpen(false);
    reset();
  };

  const { handleSubmit } = useFormContext<FormType>();
  const { onSubmitUpdate } = useNewInvoiceForm();

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
