import * as m from "motion/react-m";
import styled from "styled-components";

const AnimatedText = styled.h1`
  position: relative;
  font-family: ${({ theme }) => theme.font};
  font-size: 64px;
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1.2;
  text-align: center;
  margin-top: 20%;
  margin-left: 0;
  color: ${({ theme }) => theme.text};
`;

type TextAnimationProps = {
  text: string;
  className?: string;
  testId: string;
};

function TextAnimation({ text, testId }: TextAnimationProps) {
  return (
    <AnimatedText className="text-animation" data-testid={testId}>
      {text.split(" ").map((el, i) => (
        <m.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.25,
            delay: i / 6,
          }}
          key={i}
        >
          {el}{" "}
        </m.span>
      ))}
    </AnimatedText>
  );
}

export default TextAnimation;
