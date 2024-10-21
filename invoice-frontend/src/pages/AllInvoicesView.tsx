import { Link } from 'react-router-dom';
import styled from 'styled-components';
import InvoiceGrid from '../components/invoice-components/InvoiceGrid';
import InvoiceCard from '../components/invoice-components/InvoiceCard';
import EmptyList from '../components/EmptyList';

const StyledLink = styled(Link)`
  width: ${(props) => (props.isMobile ? '100%' : '50%')};
  min-width: ${(props) => (props.isMobile ? 'auto' : '730px')};
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface AllInvoicesViewProps {
    invoiceList: Invoice[];
    isNewOpen: boolean;
    setIsNewOpen: React.Dispatch<React.SetStateAction<boolean>>;
    width: number;
    scrollToTop: () => void;
}

const AllInvoicesView = ({ invoiceList, isNewOpen, setIsNewOpen, width, scrollToTop }: AllInvoicesViewProps) => {
    return (
        <>
            {/* MemoizedAllInvoicesToolbar and NewInvoice components */}
            {invoiceList.length > 0 ? (
                <InvoiceGrid>
                    {invoiceList.map((invoice) => (
                        <StyledLink
                            key={invoice.id}
                            to={`/${invoice.id}`}
                            isMobile={width < 1200}
                            onClick={scrollToTop}
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
