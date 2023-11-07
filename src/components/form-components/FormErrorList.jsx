import { ErrorList, ErrorText } from "../../styles/editStyles";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

function FormErrorList({ isEditOpen }) {

  const { formState: { errors } } = useFormContext();

  const isFieldErrors = () => Object.keys(errors).find(item => item !== "myFieldArray" && item !== "items");

  return <ErrorList>
    <ErrorText style={{ display: (isFieldErrors() || errors.items) && isEditOpen ? "block" : "none" }}>- All fields must be
            added</ErrorText>
    <ErrorText style={{ display: errors.myFieldArray && isEditOpen ? "block" : "none" }}>- An item must be added</ErrorText>
  </ErrorList>;
}

export default FormErrorList;

FormErrorList.propTypes = {
  isEditOpen: PropTypes.bool.isRequired
};
