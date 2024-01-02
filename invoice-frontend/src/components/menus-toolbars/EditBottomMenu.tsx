import styled from "styled-components";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import CancelButton from "../buttons/CancelButton";

const MenuContainer = styled.div`
  z-index: 100;
  width: 100%;
  max-width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  //margin-top: 2.6rem;
  margin-bottom: 4rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const NewInvoiceButton = styled.input`
  padding: 0 24px;
  border-radius: 24px;
  background-color: #7c5dfa;
  border: none;
  height: 44px;
  //width: 90px;
  display: inline;
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

type EditBottomMenuProps = {
  closeText: string;
  justifyCancel: string;
  onSubmit: () => void;
  saveText: string;
  setIsOpen: (b: boolean) => void;
};

function EditBottomMenu({
  setIsOpen,
  saveText,
  closeText,
  justifyCancel,
  onSubmit,
}: EditBottomMenuProps) {
  const { reset } = useFormContext();

  const closeMenu = () => {
    setIsOpen(false);
    reset();
    // setItems(invoice.items);
  };

  const handleSubmitClick = () => {
    onSubmit();
  };

  return (
    <MenuContainer>
      <CancelButton
        handleClick={closeMenu}
        text={closeText}
        justifySelf={justifyCancel}
      />
      <NewInvoiceButton
        type="button"
        value={saveText}
        onClick={handleSubmitClick}
      />
    </MenuContainer>
  );
}

export default EditBottomMenu;

EditBottomMenu.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  saveText: PropTypes.string.isRequired,
  closeText: PropTypes.string.isRequired,
  // justifyCancel: PropTypes.string,
  // setItems: PropTypes.func,
  // invoice: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};
