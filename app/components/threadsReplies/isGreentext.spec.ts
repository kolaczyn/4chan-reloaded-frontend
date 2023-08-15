import { describe, it, expect } from "vitest";
import { isGreentext } from "./isGreentext";

describe("isGreentext", () => {
  it("should return true if text starts with >", () => {
    expect(isGreentext(">")).toBe(true);
    expect(isGreentext(">tfw no gf")).toBe(true);
  });

  it("should return false if text does not start with >", () => {
    expect(isGreentext("")).toBe(false);
    expect(isGreentext("tfw no gf")).toBe(false);
  });

  it("should return false if text starts with >>", () => {
    expect(isGreentext(">>")).toBe(false);
    expect(isGreentext(">>tfw no gf")).toBe(false);
  });
});
