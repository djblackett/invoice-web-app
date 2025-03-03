import { useState, useEffect } from "react";
import styled from "styled-components";

const FadeOutText = styled.h1`
  font-size: x-large;
  margin: 8px;
  padding: 0;
  font-weight: 700;
  opacity: 1;
  transition: all 1s ease-in;
  text-align: center;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

type FadeOutProps = {
  username: string | undefined;
  className: string;
};

const FadeOut = ({ username, className }: FadeOutProps) => {
  const [height, setHeight] = useState("32px");
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    setTimeout(() => {
      setOpacity(0);
    }, 3000);
    setTimeout(() => {
      setHeight("0px");
    }, 3500);
  }, []);
  return (
    <FadeOutText
      className={className}
      style={{ height: height, opacity: opacity }}
    >
      Welcome {username}
    </FadeOutText>
  );
};

export default FadeOut;
