import { PrismaClient } from "@prisma/client";

import { logger } from "./logging";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db =
  globalThis.prisma ||
  new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "event",
        level: "error",
      },
      {
        emit: "event",
        level: "info",
      },
      {
        emit: "event",
        level: "warn",
      },
    ],
  });

// @ts-ignore
db.$on("error", (e) => {
  logger.error(e);
});
// @ts-ignore
db.$on("warn", (e) => {
  logger.warn(e);
});
// @ts-ignore
db.$on("info", (e) => {
  logger.info(e);
});
// @ts-ignore
db.$on("query", (e) => {
  logger.info(e);
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
