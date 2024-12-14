import { Label, Input } from "../../styles/editStyles";
import LongFormEntry from "./LongFormEntry";
import { Invoice } from "../../types/types";
import { useFormContext } from "react-hook-form";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider";

interface DescriptionProps {
  invoice?: Invoice;
}

function Description({ invoice }: DescriptionProps) {
  const {
    formState: { errors },
    register,
  } = useFormContext();
  const { isDraft } = useNewInvoiceContext();
  return (
    <>
      <LongFormEntry className="project-description">
        <Label
          htmlFor="projectDescription"
          style={{ color: errors.projectDescription ? "#EC5757" : "" }}
        >
          Project Description
        </Label>
        <Input
          type="text"
          defaultValue={invoice?.description}
          {...register("projectDescription", { required: !isDraft })}
          style={{
            border: errors.projectDescription ? "1px solid #EC5757" : "",
          }}
        />
      </LongFormEntry>
    </>
  );
}

export default Description;
