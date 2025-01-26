import styled, { css } from "styled-components";

interface DateBox {
  className?: string;
  long?: boolean;
}

interface DateInputProps {
  className?: string;
  ref: React.ForwardedRef<unknown>;
}

export const CustomDateBox = styled.div<DateBox>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 48px;
  border-radius: 4px;
  border-color: ${({ theme }) => theme.formFieldOutline};
  border-style: solid;
  padding: 0 20px 0 16px;
  margin-bottom: 1.5rem;
  caret-color: #7c5dfa;
  outline: none;
  border-width: 1px;
  cursor: pointer;

  letter-spacing: -0.25px;

  color: ${({ theme }) => theme.textPlain};
  background-color: ${({ theme }) => theme.inputBackgroundColor};

  &:focus,
  &:hover {
    border-color: ${({ theme }) => theme.formFieldOutlineFocus};
  }

  .custom-input {
    padding: 0;
  }

  ${(props) =>
    props.long &&
    css`
      width: 100%;
    `}
`;

export const DateInput = styled.input<DateInputProps>`
  color: ${({ theme }) => theme.dateText};
  font-family: ${({ theme }) => theme.font};
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  background-color: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  width: auto;
  flex-shrink: 1;

  &:focus,
  &:hover {
    border-color: ${({ theme }) => theme.formFieldOutlineFocus};
  }
`;
