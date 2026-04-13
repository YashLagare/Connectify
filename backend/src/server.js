import { clerkMiddleware } from "@clerk/express";
import express from "express";
import { serve } from "inngest/express";
import { ENV } from "./config/env.js";
import { functions, inngest } from "./config/inngest.js";
import { connectDB } from "./DB/db.js";

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
  res.send("Hello Worldqq!");
});

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
