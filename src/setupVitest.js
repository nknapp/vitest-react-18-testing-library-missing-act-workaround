import { afterEach, beforeAll, expect } from "vitest";
import "whatwg-fetch";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

/* global globalThis */

// Remove the following comments to get rid of the warning: "Warning: The current testing environment is not configured to support act(...)"
// Object.defineProperty(globalThis,"IS_REACT_ACT_ENVIRONMENT", {
//   get() {
//     if (typeof globalThis.self !== 'undefined') {
//       return globalThis.self.IS_REACT_ACT_ENVIRONMENT
//     }
//   },
//   set(value) {
//     if (typeof globalThis.self !== 'undefined') {
//       globalThis.self.IS_REACT_ACT_ENVIRONMENT = value
//     }
//   }
// })

globalThis.IS_REACT_ACT_ENVIRONMENT = true


beforeAll(() => {
  expect.extend(matchers);
});

afterEach(cleanup);

export {};
