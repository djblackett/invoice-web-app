import React, { CSSProperties } from "react";
import { OppositeWidthContainer } from "@/styles/FormEntryStyles.tsx";
import { FormEntryContainer } from "./LongFormEntry.tsx";

type FormEntryProps = {
  children: React.ReactNode;
  className: string;
  isLongOnMobile?: boolean;
  style?: CSSProperties;
};

function FormEntry({
  className,
  isLongOnMobile,
  children,
  style,
}: FormEntryProps) {
  // mobile view gets a longer component, hence the awkward naming scheme here
  if (isLongOnMobile) {
    return (
      <OppositeWidthContainer className={className} style={{ ...style }}>
        {children}
      </OppositeWidthContainer>
    );
  }

  return (
    <FormEntryContainer className={className}>{children}</FormEntryContainer>
  );
}

export default FormEntry;
