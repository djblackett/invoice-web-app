import styled from "styled-components";
import { toast, Theme } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation } from "@apollo/client";
import { MARK_AS_PAID } from "../../../invoices/graphql/invoice.queries.ts";
import { MutableRefObject } from "react";
import { Invoice } from "@/features/invoices/types/invoiceTypes.ts";

const Button = styled.button`
  background-color: ${({ theme }) => theme.newButton};
  border-radius: 24px;
  padding: 16px 19px 17px 19px;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.25px;
  white-space: nowrap;
  scale: 0.85;

  &:hover {
    background-color: ${({ theme }) => theme.newButtonHover};
  }

  @media (min-width: 300px) {
    padding: 16px 24px 17px 24px;
    scale: 1;
    margin: 0.25rem;
  }
`;

type MarkPaidProps = {
  invoice: Invoice;
  editButtonRef: MutableRefObject<HTMLButtonElement | null>;
};

function MarkAsPaidButton({ invoice, editButtonRef }: MarkPaidProps) {
  const colorMode = localStorage.getItem("theme");

  const [markAsPaid] = useMutation(MARK_AS_PAID, {
    onError: (error) => {
      console.error(error.graphQLErrors[0].message);
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
      <Button onClick={handleClick} type="button" data-testid="mark-as-paid">
        Mark as Paid
      </Button>
    </>
  );
}

export default MarkAsPaidButton;
