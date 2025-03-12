import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useForm, FormProvider } from "react-hook-form";
import { NewInvoiceProvider } from "@/features/invoices/forms/NewInvoiceContextProvider";
import useFormCaching from "@/features/invoices/hooks/useFormCaching";
import { describe, beforeEach, it, expect, vi } from "vitest";

const createWrapper = () => {
  const methods = useForm();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <NewInvoiceProvider>
      <FormProvider {...methods}>{children}</FormProvider>
    </NewInvoiceProvider>
  );
  Wrapper.displayName = "FormProviderWrapper";
  return Wrapper;
};

const cacheKey = "testCacheKey";

describe.skip("useFormCaching hook", () => {
  const dummyFormData = { field: "value" };
  let methods: ReturnType<typeof useForm>;

  beforeEach(() => {
    localStorage.clear();
    methods = useForm();
    // methods.getValues = vi.fn(() => dummyFormData);
    // methods.reset = vi.fn();
  });

  it("should cache form data using localStorage", () => {
    const { result } = renderHook(() => useFormCaching(cacheKey), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.cacheFormData();
    });

    expect(localStorage.getItem(cacheKey)).toEqual(
      JSON.stringify(dummyFormData),
    );
  });

  it("should clear cache and call setIsCacheActive(false)", () => {
    const { result } = renderHook(() => useFormCaching(cacheKey), {
      wrapper: createWrapper(),
    });

    // Pre-populate localStorage
    localStorage.setItem(cacheKey, JSON.stringify(dummyFormData));

    act(() => {
      result.current.clearCache();
    });

    expect(localStorage.getItem(cacheKey)).toBeNull();
    // Assuming setIsCacheActive is part of the context, you can mock and verify its call here
  });

  it("should restore cached data on mount when isCacheActive is true", () => {
    const { result } = renderHook(() => useFormCaching(cacheKey), {
      wrapper: createWrapper(),
    });

    // Assuming isCacheActive is part of the context, set it to true before rendering
    // You might need to mock this part based on your implementation

    const cachedData = JSON.stringify(dummyFormData);
    localStorage.setItem(cacheKey, cachedData);

    // useEffect should call reset with parsed cachedData
    expect(methods.reset).toHaveBeenCalledWith(dummyFormData);
  });

  it("should not restore cached data if there is none", () => {
    const { result } = renderHook(() => useFormCaching(cacheKey), {
      wrapper: createWrapper(),
    });

    expect(methods.reset).not.toHaveBeenCalled();
  });
});
