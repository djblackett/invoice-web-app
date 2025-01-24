import { motion } from "motion/react";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const sidebarWidth = 700; // Define the sidebar width in pixels
  // todo - may need breakpoints for different screen sizes
  // Variants for the sidebar animation
  const sidebarVariants = {
    hidden: {
      x: `${-sidebarWidth}px`, // Start hidden
    },
    visible: {
      x: "0", // Slide into view
    },
    exit: {
      x: `${-sidebarWidth}px`, // Slide out of view
    },
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
          zIndex: 1000,
          cursor: "pointer",
        }}
      />
      <motion.div
        variants={sidebarVariants}
        key="sidebar"
        initial={"hidden"}
        animate={"visible"}
        exit={"exit"}
        transition={{
          type: "tween",
          duration: 0.3,
          ease: "easeInOut",
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${sidebarWidth}px`,
          height: "100%",
          // backgroundColor: "#2c3e50",
          color: "#ecf0f1",
          padding: "20px",
          zIndex: 1001, // Above the overlay
          boxShadow: "2px 0 5px rgba(0,0,0,0.3)",
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default Sidebar;
