import { useFieldArray, SubmitHandler } from 'react-hook-form';
import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_INVOICE, ALL_INVOICES } from '../graphql/queries';
import { v4 as uuidv4 } from 'uuid';
import { createInvoiceObject } from '../utils/utilityFunctions';
import { FormType } from '../types/types';
import { useNewInvoiceContext } from '../components/form-components/NewInvoiceContextProvider';
import { flushSync } from 'react-dom';

export const useNewInvoiceForm = () => {

    const { startDate,
        isDraft,
        setIsDraft,
        setIsNewInvoiceOpen,
        selectedPaymentOption,
        setSelectedPaymentOption,
        methods } = useNewInvoiceContext();

    const {
        control,
        trigger,
        reset,
        watch,
        setError,
        clearErrors,
        getValues,
    } = methods;

    const { replace } = useFieldArray({
        control,
        name: 'items',
    });


    const watcher = watch();

    // Mutation to add a new invoice
    const [addInvoice] = useMutation(ADD_INVOICE, {
        refetchQueries: [{ query: ALL_INVOICES }],
        onError: (error) => {
            console.error(error);
        },
    });


    // Handle form reset
    const handleFormReset = () => {
        setSelectedPaymentOption(1);
        reset();
        clearErrors();
        replace([{ id: uuidv4(), name: '', quantity: 0, price: 0, total: 0 }]);
        setIsNewInvoiceOpen(false);
    };

    // Handle form submission
    const onSubmit: SubmitHandler<FormType> = async (data) => {
        console.log("Submitting form");
        flushSync(() => setIsDraft(false));

        data = getValues();
        console.log("Hello");
        console.log(data);

        if (!data.items) {
            console.log("No items");
            setError('items', { type: 'custom', message: 'An item must be added' });
            return;
        }

        const isValid = await trigger();
        console.log("isValid:", isValid);
        console.log(isDraft);
        if (isValid) {
            const newInvoice = createInvoiceObject(data, startDate, selectedPaymentOption);

            // Ensure quantity and price are numbers
            newInvoice.items = newInvoice.items.map((item) => ({
                ...item,
                quantity: Number(item.quantity),
                price: Number(item.price),
            }));

            newInvoice.status = "pending"

            try {
                await addInvoice({
                    variables: {
                        ...newInvoice,
                    },
                });
                handleFormReset();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const onSubmitDraft: SubmitHandler<FormType> = async (data) => {
        console.log("Submitting draft");
        clearErrors();
        flushSync(() => clearErrors());
        console.log("isDraft:", isDraft)
        if (!data.items) {
            data.items = [{ id: "", name: "", quantity: 0, price: 0, total: 0 }]
        }

        const newInvoice = createInvoiceObject(data, startDate, selectedPaymentOption);

        // Ensure quantity and price are numbers
        newInvoice.items = newInvoice.items.map((item) => ({
            ...item,
            quantity: Number(item.quantity) || 0,
            price: Number(item.price) || 0,
        }));

        newInvoice.status = "draft";

        try {
            await addInvoice({
                variables: {
                    ...newInvoice,
                },
            });
            handleFormReset();
            reset()
        } catch (error) {
            console.error(error);
        }
        // }
    };


    useEffect(() => {
        if (!watcher.items) {
            setError('items', { type: 'custom', message: 'An item must be added' });
        } else {
            // Clear error if items are present
            clearErrors('items');
        }
    }, [watcher.items, setError]);

    return {
        methods,
        onSubmit,
        onSubmitDraft,
    };
};
