import { Label, Input } from "../../../styles/editPageStyles.ts";
import LongFormEntry from "./LongFormEntry.tsx";
import { Invoice } from "../../../types/types.ts";
import { useFormContext } from "react-hook-form";
import { useNewInvoiceContext } from "./NewInvoiceContextProvider.tsx";

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
          id="projectDescription"
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
