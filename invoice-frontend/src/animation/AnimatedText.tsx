import * as m from "motion/react-m";
import styled from "styled-components";

const AnimatedText = styled.div`
  position: relative;
  font-family: sans-serif;
  font-size: 60px;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.2;
  text-align: center;
  margin: 100px 0 40px;
  color: ${({ theme }) => theme.text};

  @media (min-width: 1200px) {
    margin-left: 103px;
  }
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
