import { describe, expect, it } from "vitest";
import {
  DEFAULT_TOKEN,
  accessToken,
  escapeHtml,
  expectedToken,
  pickLanguage,
  safeEqual,
  safeNext,
} from "@/lib/access";

describe("accessToken", () => {
  it("is a deterministic 64-char hex HMAC", async () => {
    const a = await accessToken("correct horse");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(await accessToken("correct horse")).toBe(a);
  });

  it("changes with the password", async () => {
    expect(await accessToken("one")).not.toBe(await accessToken("two"));
  });
});

describe("expectedToken", () => {
  it("uses the default token when CV_PASSWORD is not set", async () => {
    expect(await expectedToken(undefined)).toBe(DEFAULT_TOKEN);
    expect(await expectedToken("")).toBe(DEFAULT_TOKEN);
  });

  it("derives the token from CV_PASSWORD when set", async () => {
    expect(await expectedToken("override")).toBe(await accessToken("override"));
  });
});

describe("safeEqual", () => {
  it("compares strings exactly", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "abcd")).toBe(false);
    expect(safeEqual("", "")).toBe(true);
  });
});

describe("safeNext", () => {
  it.each([
    ["/", "/"],
    ["/?lang=es", "/?lang=es"],
    ["/some/path", "/some/path"],
  ])("keeps the relative path %s", (input, expected) => {
    expect(safeNext(input)).toBe(expected);
  });

  it.each(["//evil.com", "/\\evil.com", "https://evil.com", "evil.com", "", null, undefined, 42])(
    "rejects %s as an open redirect",
    (input) => {
      expect(safeNext(input)).toBe("/");
    }
  );
});

describe("escapeHtml", () => {
  it("escapes markup characters", () => {
    expect(escapeHtml(`"><script>alert('x')</script>&`)).toBe(
      "&#34;&#62;&#60;script&#62;alert(&#39;x&#39;)&#60;/script&#62;&#38;"
    );
  });
});

describe("pickLanguage", () => {
  it("prefers the language cookie", () => {
    expect(pickLanguage("es", "en-US")).toBe("es");
    expect(pickLanguage("en", "es-MX")).toBe("en");
  });

  it("falls back to Accept-Language, then English", () => {
    expect(pickLanguage(undefined, "es-MX,es;q=0.9")).toBe("es");
    expect(pickLanguage("fr", "de-DE")).toBe("en");
    expect(pickLanguage(undefined, null)).toBe("en");
  });
});
