import { NODE_ENV, PORT } from "./config/server.config";
import { createServer } from "./server";

createServer()
  .then(([_, httpServer]) => {
    if (NODE_ENV === "production") {
      httpServer.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on  0.0.0.0:${PORT}`);
      });
    } else {
      httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
  });
