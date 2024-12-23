import styled, { useTheme } from "styled-components";
import { ToastContainer, toast, Theme } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useWindowWidth from "../../hooks/useWindowWidth";
import { Invoice } from "../../types/types";
import { useMutation } from "@apollo/client";
import { MARK_AS_PAID } from "../../graphql/queries";
import { MutableRefObject } from "react";

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

type MarkPaidProps = {
  invoice: Invoice;
  editButtonRef: MutableRefObject<HTMLButtonElement | null>;
};

function MarkAsPaidButton({ invoice, editButtonRef }: MarkPaidProps) {
  const colorMode = localStorage.getItem("theme");
  const width = useWindowWidth();
  const theme = useTheme();

  const [markAsPaid] = useMutation(MARK_AS_PAID, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const handleClick = async () => {
    if (invoice.status === "pending") {
      const response = await markAsPaid({
        variables: {
          markAsPaidId: invoice.id,
        },
      });
      if (response.data) {
        toast.success("💸 Invoice paid!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: (colorMode as Theme) || undefined,
        });
      }
    } else {
      if (editButtonRef.current) {
        editButtonRef.current.focus();
        console.log("ref:", editButtonRef.current);
      }

      toast.error("Cannot mark drafts as paid", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: (colorMode as Theme) || undefined,
      });
    }
  };
  return (
    <>
      <Button onClick={handleClick} type="button">
        Mark as Paid
      </Button>
      <ToastContainer
        style={{
          marginTop: width > 1200 ? 0 : "72px",
          backgroundColor: "transparent", // theme.background,
        }}
      />
    </>
  );
}

export default MarkAsPaidButton;
