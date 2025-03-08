import React, { createContext, FC, ReactNode, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { FormType, Item } from "@/features/invoices/types/invoiceTypes.ts";

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
  isCacheActive: boolean;
  setIsCacheActive: React.Dispatch<React.SetStateAction<boolean>>;
}

interface InitialState {
  isDraft?: boolean;
  startDate?: Date | null;
  items?: Item[];
  selectedPaymentOption?: number;
  isNewInvoiceOpen?: boolean;
  isPaymentOpen?: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function useNewInvoiceContext() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

interface NewInvoiceProviderProps {
  children: ReactNode;
  initialState?: InitialState;
}

const NewInvoiceProvider: FC<NewInvoiceProviderProps> = ({
  children,
  initialState = {},
}) => {
  const {
    isDraft = false,
    startDate = new Date(),
    items = [],
    selectedPaymentOption = 1,
    isNewInvoiceOpen = false,
    isPaymentOpen = false,
  } = initialState;

  const [isDraftState, setIsDraft] = useState<boolean>(isDraft);
  const [startDateState, setStartDate] = useState<Date | null>(startDate);
  const [itemsState, setItems] = useState<Item[]>(items);
  const [selectedPaymentOptionState, setSelectedPaymentOption] =
    useState<number>(selectedPaymentOption);
  const [isNewInvoiceOpenState, setIsNewInvoiceOpen] =
    useState<boolean>(isNewInvoiceOpen);
  const [isPaymentOpenState, setIsPaymentOpen] =
    useState<boolean>(isPaymentOpen);
  const [isCacheActive, setIsCacheActive] = useState(false);

  const handlePaymentClick = () => {
    setIsPaymentOpen(!isPaymentOpenState);
  };

  const handleChangeSelectedOption = (option: number) => {
    setSelectedPaymentOption(option);
  };

  const methods = useForm<FormType>({
    mode: "onChange",
    criteriaMode: "all",
  });

  const value: AppContextType = {
    isDraft: isDraftState,
    setIsDraft: setIsDraft,
    startDate: startDateState,
    setStartDate: setStartDate,
    items: itemsState,
    setItems: setItems,
    selectedPaymentOption: selectedPaymentOptionState,
    setSelectedPaymentOption: setSelectedPaymentOption,
    isNewInvoiceOpen: isNewInvoiceOpenState,
    setIsNewInvoiceOpen: setIsNewInvoiceOpen,
    handlePaymentClick,
    isPaymentOpen: isPaymentOpenState,
    handleChangeSelectedOption,
    methods,
    isCacheActive,
    setIsCacheActive,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { NewInvoiceProvider, useNewInvoiceContext };
