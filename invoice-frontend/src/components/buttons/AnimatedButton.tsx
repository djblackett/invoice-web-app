import { motion } from "framer-motion";
import styled from "styled-components";

export const SlidingComponent = styled(motion.div)`
  justify-self: center;
  align-self: center;
  height: fit-content;
  width: fit-content;
`;

function AnimatedButton() {
  return <motion.button whileTap={{ scale: 0.85 }}>Login</motion.button>;
}
export default AnimatedButton;
