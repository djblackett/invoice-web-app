import { motion } from "framer-motion";
import styled from "styled-components";

// .App {
//   font-family: sans-serif;
//   text-align: center;
//   padding: 100px 30px;
// }

// button {
//   font-size: 1.25rem;
//   background-color: #0f75ae;
//   padding: 1rem 1.5rem;
//   border-radius: 1rem;
//   cursor: pointer;
//   border: none;
//   color: #fafbfc;
// }

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
