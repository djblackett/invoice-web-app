import { Link, LinkProps } from 'react-router-dom';
import styled from 'styled-components';
import InvoiceGrid from './invoice-components/InvoiceGrid';
import InvoiceCard from './invoice-components/InvoiceCard';
import EmptyList from './EmptyList';
import { Invoice } from '../types/types';


interface StyledLinkProps extends LinkProps {
    isMobile: boolean;
}

const StyledLink = styled(Link) <StyledLinkProps>`
  width: ${(props) => (props.isMobile ? '100%' : '50%')};
  min-width: ${(props) => (props.isMobile ? 'auto' : '730px')};
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface AllInvoicesViewProps {
    invoiceList: Invoice[];
    width: number;
    // scrollToTop: () => void;
}

const AllInvoicesView = ({ invoiceList, width }: AllInvoicesViewProps) => {
    return (
        <>
            {invoiceList.length > 0 ? (
                <InvoiceGrid>
                    {invoiceList.map((invoice) => (
                        <StyledLink
                            key={invoice.id}
                            to={`/${invoice.id}`}
                            isMobile={width < 1200}

                        >
                            <InvoiceCard invoice={invoice} />
                        </StyledLink>
                    ))}
                </InvoiceGrid>
            ) : (
                <EmptyList />
            )}
        </>
    );
};

export default AllInvoicesView;
