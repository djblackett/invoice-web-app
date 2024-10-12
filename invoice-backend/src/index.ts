// index.ts
import { PORT } from "./config/server.config";
import { createServer } from "./server";

createServer()
  .then(([_, httpServer]) => {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
  });
