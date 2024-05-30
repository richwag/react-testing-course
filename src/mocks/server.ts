import { setupServer } from "msw/node";
import { handlers } from "./handlers.ts";

console.log("handlers", handlers);

export const server = setupServer(...handlers);
