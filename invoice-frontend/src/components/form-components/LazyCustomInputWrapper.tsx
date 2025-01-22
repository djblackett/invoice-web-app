// LazyCustomInputWrapper.tsx
import React, { forwardRef, Suspense } from "react";
import type { CustomInputProps } from "./ExampleCustomInput";

// 1) Lazy load your actual forwardRef component
const LazyCustomInput = React.lazy(() => import("./ExampleCustomInput"));

// 2) Wrap it in another forwardRef
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
