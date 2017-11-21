import rules from "./rules";

describe("Required rule", () => {
  it("fails for invalid values", () => {
    ["", " ", undefined, null].forEach(val => {
      expect(rules.required(val, true)).toBe(false);
    });
  });

  it("passes for valid values", () => {
    ["hello", 1].forEach(val => {
      expect(rules.required(val, true)).toBe(true);
    });
  });
});

describe("Minimum rule", () => {
  it("Validates values above the minimum", () => {
    ["long text", [1, 2, 3, 5, 6], 55].forEach(val => {
      expect(rules.min(val, 4)).toBe(true);
    });
  });

  it("Validates values below the minimum", () => {
    ["lol", [1, 2, 6], 3].forEach(val => {
      expect(rules.min(val, 4)).toBe(false);
    });
  });
});

describe("Equality rule", () => {
  [["foo", "foo"], [1, 1]].forEach(([a, b]) => {
    expect(rules.equals(a, b)).toBe(true);
  });
});
