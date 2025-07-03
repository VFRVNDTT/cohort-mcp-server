#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
console.error("Cohort Index: Script started.");
// Global error handler
process.on('uncaughtException', (err, origin) => {
    console.error(`Cohort Index: Uncaught Exception at: ${origin}, error: ${err}`);
    process.exit(1);
});
(0, server_1.startServer)();
