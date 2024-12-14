import React, { CSSProperties } from "react";
import { OppositeWidthContainer } from "../../styles/FormEntryStyles";
import { FormEntryContainer } from "./LongFormEntry";

type FormEntryProps = {
  children: React.ReactNode;
  className: string;
  isLongOnMobile?: boolean;
  style?: CSSProperties;
};

// todo double check the mobile layout here
function FormEntry({
  className,
  isLongOnMobile,
  children,
  style,
}: FormEntryProps) {
  // const [isDirty, setIsDirty] = useState(false);
  // const handleChange = () => {
  //   setIsDirty(true);
  // };

  // const renderChildren = () => React.Children.map(children, (child) => React.cloneElement(child, {
  //   isDirty,
  // }));

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
