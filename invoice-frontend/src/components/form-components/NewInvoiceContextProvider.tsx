import React, { createContext, FC, ReactNode, useState } from "react";
import { FormType, Item } from "../../types/types";
import { useForm, UseFormReturn } from "react-hook-form";

interface AppContextType {
  isDraft: boolean;
  setIsDraft: React.Dispatch<React.SetStateAction<boolean>>;
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  selectedPaymentOption: number;
  setSelectedPaymentOption: React.Dispatch<React.SetStateAction<number>>;
  isNewInvoiceOpen: boolean;
  setIsNewInvoiceOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handlePaymentClick: () => void;
  isPaymentOpen: boolean;
  handleChangeSelectedOption: (option: number) => void;
  methods: UseFormReturn<FormType>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function useNewInvoiceContext() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

const NewInvoiceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isDraft, setIsDraft] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(1);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handlePaymentClick = () => {
    setIsPaymentOpen(!isPaymentOpen);
  };

  // Handle payment option change
  const handleChangeSelectedOption = (option: number) => {
    setSelectedPaymentOption(option);
  };

  // Initialize the form
  const methods = useForm<FormType>({
    mode: "onChange",
  });

  const value = {
    isDraft,
    setIsDraft,
    startDate,
    setStartDate,
    items,
    setItems,
    selectedPaymentOption,
    setSelectedPaymentOption,
    isNewInvoiceOpen,
    setIsNewInvoiceOpen,
    handlePaymentClick,
    isPaymentOpen,
    handleChangeSelectedOption,
    methods,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { NewInvoiceProvider, useNewInvoiceContext };
