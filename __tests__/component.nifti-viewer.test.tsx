/**
 * @jest-environment jsdom
 */

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { describe, expect, test, beforeEach, afterEach } from "@jest/globals";
import NiftiViewer from "../src/NiftiViewer";
import React from "react";

// file needs .tsx extension.  See https://stackoverflow.com/questions/53375144/how-to-write-the-tests-for-a-react-native-library-for-definitelytyped

let container: HTMLElement | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  if (container) {
    unmountComponentAtNode(container);
    container.remove();
  }
  container = null;
});

describe("NiftiViewer component", () => {
  test("renders with a host id", () => {
    act(() => {
      render(<NiftiViewer hostId="host-id" />, container);
    });
    expect(container).not.toBeNull();
    if (container) {
      expect(container.textContent).toContain("My host element is host-id");
    }
  });
});
