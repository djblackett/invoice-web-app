import container from "./config/inversify.config";
import { NODE_ENV, PORT } from "./config/server.config";
import { createServer } from "./server";
import { Logger } from "@/config/logger.config";

const logger = container.get(Logger);

createServer()
  .then(([, httpServer]) => {
    if (NODE_ENV === "production") {
      httpServer.listen(PORT, "0.0.0.0", () => {
        logger.info(`Server running on 0.0.0.0:${PORT}`);
      });
    } else {
      httpServer.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((error) => {
    logger.error("Error starting server:", error);
    process.exit(1);
  });
