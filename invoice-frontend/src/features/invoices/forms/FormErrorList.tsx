import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import { ErrorList, ErrorText } from "../../../styles/editPageStyles.ts";

type FormErrorListProps = {
  isEditOpen: boolean;
};
function FormErrorList({ isEditOpen }: FormErrorListProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const isFieldErrors = () =>
    Object.keys(errors).find(
      (item) => item !== "myFieldArray" && item !== "items",
    );

  return (
    <ErrorList>
      <ErrorText
        style={{
          visibility:
            (isFieldErrors() || errors.items) && isEditOpen
              ? "visible"
              : "hidden",
        }}
      >
        - All fields must be added
      </ErrorText>
      <ErrorText
        style={{
          visibility: errors.myFieldArray && isEditOpen ? "visible" : "hidden",
        }}
      >
        - An item must be added
      </ErrorText>
    </ErrorList>
  );
}

export default FormErrorList;

FormErrorList.propTypes = {
  isEditOpen: PropTypes.bool.isRequired,
};
