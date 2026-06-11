import { searchStaticItems } from "@/lib/searchSources";

describe("searchStaticItems", () => {
  it("returns matching items by title", () => {
    const results = searchStaticItems("excel");

    expect(results.some((item) => item.id === "excel")).toBe(true);
  });

  it("matches case-insensitively", () => {
    const results = searchStaticItems("JSON");

    expect(results.some((item) => item.id === "format-json")).toBe(true);
  });

  it("returns empty array when nothing matches", () => {
    expect(searchStaticItems("zzznomatch")).toEqual([]);
  });

  it("supports partial matches", () => {
    const results = searchStaticItems("exc");

    expect(results.some((item) => item.id === "excel")).toBe(true);
  });

  it("matches subtitle text", () => {
    const results = searchStaticItems("yapılandırılmış");

    expect(results.some((item) => item.id === "format-json")).toBe(true);
  });
});
