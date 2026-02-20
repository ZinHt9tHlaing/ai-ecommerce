import "dotenv/config";
import { app } from "./app";
import connectDB from "./db/database";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  logger.info(`Server ready at: http://localhost:${PORT}`);
});
