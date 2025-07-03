#!/usr/bin/env node
import { startServer } from "./server";

console.error("Cohort Index: Script started.");

// Global error handler
process.on('uncaughtException', (err, origin) => {
  console.error(`Cohort Index: Uncaught Exception at: ${origin}, error: ${err}`);
  process.exit(1);
});

startServer();