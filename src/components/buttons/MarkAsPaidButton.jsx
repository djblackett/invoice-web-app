import styled, {useTheme} from "styled-components";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { markAsPaid } from "../../features/invoices/invoicesSlice";
import "react-toastify/dist/ReactToastify.css";
import useWindowWidth from "../../hooks/useWindowWidth";

const Button = styled.button`
  background-color: ${({ theme }) => theme.newButton};
  border-radius: 24px;
  padding: 16px 24px 17px 24px;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  margin: 0.25rem;
  /* identical to box height, or 125% */

  letter-spacing: -0.25px;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.newButtonHover};
  }
`;

function MarkAsPaidButton({ invoice }) {

    const colorMode = localStorage.getItem("theme");
    const width = useWindowWidth();
    const theme = useTheme();
    const dispatch = useDispatch();

    const handleClick = () => {
        if (invoice.status === "pending") {
            dispatch(markAsPaid(invoice.id));
            toast.success("💸 Invoice paid!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: colorMode
            });
        }
    };
    return (
        <>
            <Button onClick={handleClick} type="button">Mark as Paid</Button>
            <ToastContainer style={{ marginTop: width > 1200 ? 0 : "72px", backgroundColor:  theme.background}}/>
        </>
    );
}

export default MarkAsPaidButton;