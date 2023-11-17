import styled from "styled-components";
import React, {CSSProperties} from "react";

export const FormEntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  font-style: ${({ theme }) => theme.font};
  width: 100%;
`;

type LongFormEntryProps = {
  children: React.ReactNode;
  className: string;
  // eslint-disable-next-line react/require-default-props
  style?: CSSProperties | undefined
}

function LongFormEntry({ className, children, style }: LongFormEntryProps) {

  const handleChange = () => {

  };

  return (
    <FormEntryContainer
      onChange={handleChange}
      className={className}
      style={style}
    >
      {children}
    </FormEntryContainer>
  );
}

export default LongFormEntry;
