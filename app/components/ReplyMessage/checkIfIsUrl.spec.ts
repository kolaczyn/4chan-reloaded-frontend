import { describe, it, expect } from "vitest";
import { checkIfIsUrl } from "./checkIfIsUrl";

describe("checkIfIsUrl", () => {
  it("returns true if it starts with https:// or http://", () => {
    expect(checkIfIsUrl("https://google.com")).toBe(true);
    expect(checkIfIsUrl("http://google.com")).toBe(true);
    expect(checkIfIsUrl("http://hello")).toBe(true);
    expect(checkIfIsUrl("https://hello")).toBe(true);
  });

  it("returns false otherwise", () => {
    expect(checkIfIsUrl("hello")).toBe(false);
    expect(checkIfIsUrl("")).toBe(false);
  });
});
