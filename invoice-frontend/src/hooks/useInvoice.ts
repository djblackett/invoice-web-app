import { useQuery } from '@apollo/client';
import { GET_INVOICE_BY_ID } from '../graphql/queries';

import apolloClient from '../graphql/apollo-client';
import { useParams } from 'react-router-dom';

const useInvoice = () => {
    const { id } = useParams();
  const { data, loading, error } = useQuery(GET_INVOICE_BY_ID, {
    client: apolloClient,
    variables: { getInvoiceByIdId: id }
  });

  const invoice = data?.getInvoiceById;

   return { invoice, loading, error };
}

export default useInvoice;
