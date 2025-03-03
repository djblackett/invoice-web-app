import React, { CSSProperties } from "react";
import { OppositeWidthContainer } from "../../../styles/FormEntryStyles.tsx";
import { FormEntryContainer } from "./LongFormEntry.tsx";

type FormEntryProps = {
  children: React.ReactNode;
  className: string;
  isLongOnMobile?: boolean;
  style?: CSSProperties;
};

// todo - double check the mobile layout here
function FormEntry({
  className,
  isLongOnMobile,
  children,
  style,
}: FormEntryProps) {
  // mobile view gets a longer component, hence the awkward naming scheme here
  if (isLongOnMobile) {
    return (
      <OppositeWidthContainer
        // onChange={handleChange}
        // isDirty={isDirty}
        className={className}
        style={{ ...style }}
      >
        {children}
      </OppositeWidthContainer>
    );
  }

  return (
    <FormEntryContainer
      // onChange={handleChange}
      // isDirty={isDirty}
      className={className}
    >
      {children}
    </FormEntryContainer>
  );
}

export default FormEntry;
