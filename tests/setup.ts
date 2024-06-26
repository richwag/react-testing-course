import "@testing-library/jest-dom/vitest";
import ResizeObserver from "resize-observer-polyfill";
import { server } from "../src/mocks/server.ts";
import { PropsWithChildren } from "react";

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

vi.mock("@auth0/auth0-react", () => {
  return {
    useAuth0: vi.fn(),
    Auth0Provider: ({ children }: PropsWithChildren) => children,
    withAuthenticationRequired: vi.fn(),
  };
});

global.ResizeObserver = ResizeObserver;
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();
