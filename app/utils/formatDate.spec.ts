import { test, expect, describe } from "vitest";
import { dateInfo, formatDateExtra } from "~/utils/formatDate";

describe("formatDate", () => {
  test("dateInfo", () => {
    expect(dateInfo("2023-08-03T21:37:03.669339Z")).toEqual("03-08 at 21:37");
  });

  test("formatDateExtra", () => {
    expect(formatDateExtra("2023-08-03T21:37:03.669339Z")).toEqual(
      "21:37:03, 03-08-2023"
    );
  });
});
