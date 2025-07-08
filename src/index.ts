#!/usr/bin/env node
import { startServer } from "./server";

console.error("Cohort Index: Script started.");

// Global error handler
process.on('uncaughtException', (err, origin) => {
  console.error(`Cohort Index: Uncaught Exception at: ${origin}, error: ${err}`);
  console.error(`Cohort Index: Stack trace: ${err.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Cohort Index: Unhandled Rejection at:`, promise, 'reason:', reason);
  process.exit(1);
});

startServer().catch(err => {
  console.error(`Cohort Index: Failed to start server: ${err}`);
  console.error(`Cohort Index: Stack trace: ${err.stack}`);
  process.exit(1);
});