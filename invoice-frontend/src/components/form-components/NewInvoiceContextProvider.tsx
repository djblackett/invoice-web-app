import React, { createContext, FC, ReactNode, useState } from "react";
import { Item } from "../../types/types";


interface AppContextType {
    isDraft: boolean;
    setIsDraft: React.Dispatch<React.SetStateAction<boolean>>;
    startDate: Date;
    setStartDate: React.Dispatch<React.SetStateAction<Date>>;
    items: Item[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    selectedPaymentOption: number;
    setSelectedPaymentOption: React.Dispatch<React.SetStateAction<number>>;
    isNewInvoiceOpen: boolean;
    setIsNewInvoiceOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

function useNewInvoiceContext() {
    const context = React.useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

const NewInvoiceProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isDraft, setIsDraft] = useState(true);
    const [startDate, setStartDate] = useState(new Date());
    const [items, setItems] = useState<Item[]>([]);
    const [selectedPaymentOption, setSelectedPaymentOption] = useState(1);
    const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

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
        setIsNewInvoiceOpen
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { NewInvoiceProvider, useNewInvoiceContext };
