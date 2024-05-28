import "@testing-library/jest-dom/vitest";
import ResizeObserver from "resize-observer-polyfill";
import { server } from "../src/mocks/server.ts";

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
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
