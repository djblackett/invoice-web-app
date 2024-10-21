import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from '../types/schemas';
import { useMutation } from '@apollo/client';
import { EDIT_INVOICE } from '../graphql/queries';
import { Invoice } from '../types/types';
import { createInvoiceObject } from '../utils/utilityFunctions';

interface UseEditInvoiceFormProps {
  invoice: Invoice;
  onClose: () => void;
  startDate: Date,
  selectedPaymentOption: number,
}

interface FormData {
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];
  projectDescription: string;
  clientName: string;
  clientEmail: string;
  clientStreetAddress: string;
  clientCity: string;
  clientPostalCode: string;
  clientCountry: string;
}

export const useEditInvoiceForm = ({ invoice, onClose, startDate, selectedPaymentOption }: UseEditInvoiceFormProps) => {
  const methods = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    // todo - what?
    defaultValues: {
      // Set default values based on the invoice
      projectDescription: invoice.description,
      // ... other default values
    },
  });

  const [editInvoice, { loading, error }] = useMutation(EDIT_INVOICE);

  const { handleSubmit, setError, clearErrors, watch, trigger } = methods;

  // Error notification if invoice has no items
  useEffect(() => {
    const subscription = watch((value) => {
      if (!value.items || value.items.length === 0) {
        setError('items', { type: 'custom', message: 'An item must be added' });
      } else {
        clearErrors('items');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setError, clearErrors]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!data.items || data.items.length === 0) {
      setError('items', { type: 'custom', message: 'An item must be added' });
      return;
    }

    const isValid = await trigger();
    if (isValid) {
      const newInvoice = createInvoiceObject(data, startDate, selectedPaymentOption, invoice.id, invoice);
      await editInvoice({ variables: { ...newInvoice } });
      clearErrors();
      onClose();
    }
  };

  return {
    methods,
    onSubmit: handleSubmit(onSubmit),
    loading,
    error,
  };
};
