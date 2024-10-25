import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_INVOICE, ALL_INVOICES } from '../graphql/queries';
import { v4 as uuidv4 } from 'uuid';
import { createInvoiceObject } from '../utils/utilityFunctions';
import { FormType } from '../types/types';
import { useNewInvoiceContext } from '../components/form-components/NewInvoiceContextProvider';

export const useNewInvoiceForm = () => {
    // Initialize the form
    const methods = useForm<FormType>({
        mode: 'onChange',
        defaultValues: {
            status: 'draft',
            city: '',
            country: '',
            postalCode: '',
            streetAddress: '',
            clientName: '',
            clientEmail: '',
            clientStreetAddress: '',
            clientCity: '',
            clientCountry: '',
            clientPostalCode: '',
            projectDescription: '',
            items: [{ id: uuidv4(), name: '', quantity: 0, price: 0, total: 0 }],
        },
        // resolver: yupResolver(validationSchema),
    });

    const {
        control,
        trigger,
        reset,
        watch,
        setError,
        clearErrors,
        formState: { isSubmitSuccessful },
    } = methods;

    const { replace } = useFieldArray({
        control,
        name: 'items',
    });

    const { startDate,
        setIsDraft,
        setIsNewInvoiceOpen,
        selectedPaymentOption,
        setSelectedPaymentOption, } = useNewInvoiceContext();

    const watcher = watch();

    // Mutation to add a new invoice
    const [addInvoice] = useMutation(ADD_INVOICE, {
        refetchQueries: [{ query: ALL_INVOICES }],
        onError: (error) => {
            console.error(error);
        },
    });

    // State for payment dropdown
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    // Handle form reset
    const handleFormReset = () => {
        setSelectedPaymentOption(1);
        setIsDraft(true);
        reset();
        replace([{ id: uuidv4(), name: '', quantity: 0, price: 0, total: 0 }]);
        setIsNewInvoiceOpen(false);
    };

    // Handle form submission
    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!data.items) {
            setError('items', { type: 'custom', message: 'An item must be added' });
            return;
        }

        const isValid = await trigger();
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
        if (!data.items) {
            data.items = [{ id: "", name: "", quantity: 0, price: 0, total: 0 }]
        }

        // const isValid = await trigger();
        // if (isValid) {
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
        } catch (error) {
            console.error(error);
        }
        // }
    };

    // Handle payment dropdown toggle
    const handlePaymentClick = () => {
        setIsPaymentOpen(!isPaymentOpen);
    };

    // Handle payment option change
    const handleChangeSelectedOption = (option: number) => {
        setSelectedPaymentOption(option);
    };

    // Effect to set draft status on successful submit
    useEffect(() => {
        if (isSubmitSuccessful) {
            setIsDraft(true);
        }
    }, [isSubmitSuccessful, setIsDraft]);

    // Effect to validate items array
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
        isPaymentOpen,
        handlePaymentClick,
        handleChangeSelectedOption,
    };
};
