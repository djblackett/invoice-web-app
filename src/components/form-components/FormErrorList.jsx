import { ErrorList, ErrorText } from "../../styles/editStyles";
import { useFormContext } from "react-hook-form";

function FormErrorList() {

  const { formState: { errors } } = useFormContext();

  const isFieldErrors = () => Object.keys(errors).find(item => item !== "myFieldArray");

  return <ErrorList>
    <ErrorText style={{ display: isFieldErrors() ? "block" : "none" }}>- All fields must be
            added</ErrorText>
    <ErrorText style={{ display: errors.myFieldArray ? "block" : "none" }}>- An item must be added</ErrorText>
  </ErrorList>;
}

export default FormErrorList;