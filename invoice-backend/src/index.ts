import container from "./config/inversify.config";
import type { Logger } from "./config/logger.config";
import { NODE_ENV, PORT } from "./config/server.config";
import TYPES from "./constants/identifiers";
import { createServer } from "./server";

const logger = container.get<Logger>(TYPES.Logger);

createServer()
  .then(([, httpServer]) => {
    if (!httpServer) {
      throw new Error("HTTP server instance is undefined");
    }
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
  .catch((error: Error) => {
    logger.error(`Error starting server: ${error.message}`);
    process.exit(1);
  });
