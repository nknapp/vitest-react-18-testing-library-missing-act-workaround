import { afterEach, beforeAll, expect } from "vitest";
import "whatwg-fetch";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

// fix warning: "Warning: The current testing environment is not configured to support act(...)"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

beforeAll(() => {
  expect.extend(matchers);
});

afterEach(cleanup);

export {};
