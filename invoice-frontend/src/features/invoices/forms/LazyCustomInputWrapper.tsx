import React, { forwardRef, Suspense } from "react";
import type { CustomInputProps } from "./ExampleCustomInput";

const LazyCustomInput = React.lazy(() => import("./ExampleCustomInput"));

const CustomInputWrapper = forwardRef<HTMLInputElement, CustomInputProps>(
  (props, ref) => {
    return (
      <Suspense fallback={<div>Loading Date Input...</div>}>
        <LazyCustomInput ref={ref} {...props} />
      </Suspense>
    );
  },
);

CustomInputWrapper.displayName = "CustomInputWrapper";

export default CustomInputWrapper;
