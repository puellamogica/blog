import { describe, expect, it } from "vitest";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  isValidPassword,
} from "../src/utils/password";

describe("isValidPassword", () => {
  it("accepts a compliant password", () => {
    expect(isValidPassword("2#XswLoPePQG9qcEnyLe8$*x!AdL9pza")).toBe(true);
  });

  it("rejects passwords shorter than the minimum", () => {
    expect(isValidPassword("changeme")).toBe(false);
    expect(isValidPassword("a".repeat(PASSWORD_MIN_LENGTH - 1))).toBe(false);
  });

  it("accepts exactly the minimum length", () => {
    expect(isValidPassword("a".repeat(PASSWORD_MIN_LENGTH))).toBe(true);
  });

  it("accepts exactly the maximum length and rejects one more", () => {
    expect(isValidPassword("a".repeat(PASSWORD_MAX_LENGTH))).toBe(true);
    expect(isValidPassword("a".repeat(PASSWORD_MAX_LENGTH + 1))).toBe(false);
  });

  it("rejects characters outside the allowed set", () => {
    expect(isValidPassword("aaaaaaaaaaaaaaa-")).toBe(false);
    expect(isValidPassword("aaaaaaaaaaaaaaa_")).toBe(false);
    expect(isValidPassword("aaaaaaaaaaaaaaa ")).toBe(false);
  });

  it("accepts every allowed symbol", () => {
    expect(isValidPassword("!@#$%^&*aaaaaaaaa")).toBe(true);
  });
});
