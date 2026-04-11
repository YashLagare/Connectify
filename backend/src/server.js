import { clerkMiddleware } from "@clerk/express";
import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./DB/db.js";

const app = express();

app.use(clerkMiddleware());

const PORT = ENV.PORT ;

app.get("/", (req, res) => {
  res.send("Hello Worldqq!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

