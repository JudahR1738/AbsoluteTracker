import { cn, getInitials, isValidEmail, formatRelativeTime } from "@/lib/utils";

describe("cn()", () => {
  it("joins truthy class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });
  it("filters out falsy values", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });
  it("returns empty string when all values are falsy", () => {
    expect(cn(undefined, null, false)).toBe("");
  });
});

describe("getInitials()", () => {
  it("returns initials for a full name", () => {
    expect(getInitials("Jane Doe")).toBe("JD");
  });
  it("returns single initial for a single name", () => {
    expect(getInitials("Jane")).toBe("J");
  });
  it("strips email domain and returns initial", () => {
    expect(getInitials("jane@example.com")).toBe("J");
  });
});

describe("isValidEmail()", () => {
  it("returns true for valid email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });
  it("returns false for invalid email", () => {
    expect(isValidEmail("notanemail")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("formatRelativeTime()", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T12:00:00Z"));
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns just now for very recent dates", () => {
    expect(formatRelativeTime(new Date("2024-01-01T11:59:50Z"))).toBe("just now");
  });
  it("returns minutes ago", () => {
    expect(formatRelativeTime(new Date("2024-01-01T11:55:00Z"))).toBe("5 minutes ago");
  });
  it("returns hours ago", () => {
    expect(formatRelativeTime(new Date("2024-01-01T10:00:00Z"))).toBe("2 hours ago");
  });
  it("returns days ago", () => {
    expect(formatRelativeTime(new Date("2023-12-29T12:00:00Z"))).toBe("3 days ago");
  });
});