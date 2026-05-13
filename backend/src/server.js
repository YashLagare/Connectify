import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import { serve } from "inngest/express";
import "../instrument.mjs";
import { ENV } from "./config/env.js";
import { functions, inngest } from "./config/inngest.js";
import { connectDB } from "./DB/db.js";
import chatRoutes from "./routes/chat.route.js";

import * as Sentry from "@sentry/node";

const app = express();

app.use(express.json());
app.use(cors(
  {
    origin:  ENV.CLIENT_URL,
    credentials: true
  }
))
app.use(clerkMiddleware());

app.get("/debug-sentry", (req, res) => {
  res.send("Hello error");
});

app.get("/", (req, res) => {
  res.send("backend is working!");
});

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);

Sentry.setupExpressErrorHandler(app);

const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log(`Server is running on port ${ENV.PORT}`);
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
